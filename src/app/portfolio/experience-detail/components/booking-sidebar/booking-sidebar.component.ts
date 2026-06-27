import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ExperienceOption, ExperienceAvailability, TimeSlot } from '../../../../core/models';
import { CalendarPickerComponent } from '../calendar-picker/calendar-picker.component';
import { environment } from '../../../../../environments/environment';

interface AddOn {
  id: number;
  name: string;
  price: number;
  selected: boolean;
}

export interface BookingParams {
  date: string;
  time: string;
  guests: number;
  addons: string;
}

@Component({
  selector: 'app-booking-sidebar',
  standalone: true,
  imports: [CommonModule, CalendarPickerComponent],
  templateUrl: './booking-sidebar.component.html',
  styleUrl: './booking-sidebar.component.scss'
})
export class BookingSidebarComponent implements OnChanges {
  @Input() experienceId: number = 0;
  @Input() basePrice: number = 0;
  @Input() currency: string = '€';
  @Input() options: ExperienceOption[] = [];
  @Input() availability: ExperienceAvailability | null = null;
  @Input() maxPeople: number = 10;

  @Output() bookRequested = new EventEmitter<BookingParams>();
  @Output() contactRequested = new EventEmitter<void>();

  constructor(private http: HttpClient) {}

  selectedDate = '';
  selectedTime = '';
  guests = 1;
  guestOptions: number[] = [];
  addOns: AddOn[] = [];
  availableTimes: string[] = [];
  blockedRanges: { start: string; end: string }[] = [];

  get recurringPattern(): string {
    return (this.availability as any)?.recurring_pattern ?? 'daily';
  }

  get times(): string[] {
    return this.availableTimes.length > 0
      ? this.availableTimes
      : this.availability?.time_slots?.map((s: TimeSlot) => s.time) ?? ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM'];
  }

  ngOnChanges(): void {
    this.guestOptions = Array.from({ length: this.maxPeople }, (_, i) => i + 1);
    const seen = new Set<number>();
    this.addOns = this.options
      .filter(o => { if (seen.has(o.id)) return false; seen.add(o.id); return true; })
      .map(o => ({ id: o.id, name: o.title, price: Number(o.price), selected: false }));
    if (this.experienceId) {
      this.loadBlockedDates();
    }
  }

  private loadBlockedDates(): void {
    this.http.get<{ results: any[] }>(`${environment.apiUrl}/experiences/blocked-days/?experience=${this.experienceId}`)
      .subscribe({
        next: (res) => {
          this.blockedRanges = (res.results ?? []).map((b: any) => ({
            start: b.start_date,
            end: b.end_date,
          }));
        },
        error: () => {}
      });
  }

  onDateSelected(dateStr: string): void {
    this.selectedDate = dateStr;
    this.selectedTime = '';
    this.availableTimes = [];
    if (!this.experienceId) return;
    this.http.get<any>(`${environment.apiUrl}/experiences/${this.experienceId}/availability/?date=${dateStr}`)
      .subscribe({
        next: (res) => { this.availableTimes = (res.time_slots ?? []).map((s: TimeSlot) => s.time); },
        error: () => {}
      });
  }

  get selectedAddOns(): AddOn[] { return this.addOns.filter(a => a.selected); }
  get addOnsTotal(): number { return this.selectedAddOns.reduce((s, a) => s + a.price, 0); }
  get subtotal(): number { return (this.basePrice * this.guests) + this.addOnsTotal; }
  get serviceFee(): number { return Math.round(this.subtotal * 0.1); }
  get total(): number { return this.subtotal + this.serviceFee; }

  bookingError = '';

  incrementGuests(): void { if (this.guests < this.maxPeople) this.guests++; }
  decrementGuests(): void { if (this.guests > 1) this.guests--; }

  toggleAddOn(addOn: AddOn): void { addOn.selected = !addOn.selected; }

  bookNow(): void {
    this.bookingError = '';
    if (!this.selectedDate) { this.bookingError = 'Please select a date.'; return; }
    if (!this.selectedTime) { this.bookingError = 'Please select a time.'; return; }
    this.bookRequested.emit({
      date: this.selectedDate,
      time: this.selectedTime,
      guests: this.guests,
      addons: this.selectedAddOns.map(a => a.id).join(','),
    });
  }

  contactGuide(): void {
    this.contactRequested.emit();
  }
}
