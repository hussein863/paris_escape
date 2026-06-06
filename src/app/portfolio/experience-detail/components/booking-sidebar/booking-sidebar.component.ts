import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ExperienceOption, ExperienceAvailability, TimeSlot } from '../../../../core/models';

interface AddOn {
  id: number;
  name: string;
  price: number;
  selected: boolean;
}

@Component({
  selector: 'app-booking-sidebar',
  standalone: true,
  imports: [CommonModule, FormsModule],
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

  constructor(private router: Router) {}

  selectedDate = '';
  selectedTime = '';
  guests = 1;

  guestOptions: number[] = [];
  addOns: AddOn[] = [];

  get times(): string[] {
    return this.availability?.time_slots?.map((s: TimeSlot) => s.time) ?? ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM'];
  }

  ngOnChanges(): void {
    this.guestOptions = Array.from({ length: this.maxPeople }, (_, i) => i + 1);
    this.addOns = this.options.map(o => ({
      id: o.id,
      name: o.title,
      price: Number(o.price),
      selected: false
    }));
  }

  get selectedAddOns(): AddOn[] { return this.addOns.filter(a => a.selected); }
  get addOnsTotal(): number { return this.selectedAddOns.reduce((s, a) => s + a.price, 0); }
  get subtotal(): number { return (this.basePrice * this.guests) + this.addOnsTotal; }
  get serviceFee(): number { return Math.round(this.subtotal * 0.1); }
  get total(): number { return this.subtotal + this.serviceFee; }

  bookingError = '';

  toggleAddOn(addOn: AddOn): void { addOn.selected = !addOn.selected; }

  bookNow(): void {
    this.bookingError = '';
    if (!this.selectedDate) { this.bookingError = 'Please select a date.'; return; }
    if (!this.selectedTime) { this.bookingError = 'Please select a time.'; return; }
    this.router.navigate(['/landing/experience', this.experienceId, 'book'], {
      queryParams: {
        date: this.selectedDate,
        time: this.selectedTime,
        guests: this.guests,
        addons: this.selectedAddOns.map(a => a.id).join(',')
      }
    });
  }

  contactGuide(): void {
    this.router.navigate(['/client/messages']);
  }
}
