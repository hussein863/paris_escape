import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { ExperienceService } from '../../core/services/experience.service';
import { BookingService } from '../../core/services/booking.service';
import { AuthService } from '../../core/services/auth.service';
import { IdEncryptService } from '../../core/services/id-encrypt.service';
import { Experience } from '../../core/models';

interface CountryCode { code: string; dial: string; }

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, FooterComponent, RouterModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent implements OnInit {
  currentStep = 1;
  experience: Experience | null = null;
  loading = false;
  submitting = false;
  bookingError = '';
  bookingRef = '';
  validationErrors: Record<string, string> = {};

  selectedDate = '';
  selectedTime = '';
  adultsCount = 1;
  childrenCount = 0;
  _pendingAddonIds: number[] = [];

  firstName = '';
  lastName = '';
  email = '';
  phoneCode = '+33';
  phoneNumber = '';
  country = '';
  specialRequests = '';
  acceptTerms = false;
  receiveUpdates = false;
  createAccount = false;
  accountOption: 'signin' | 'guest' = 'guest';
  promoCode = '';

  countryCodes: CountryCode[] = [
    { code: 'FR', dial: '+33' }, { code: 'US', dial: '+1' },
    { code: 'UK', dial: '+44' }, { code: 'ES', dial: '+34' },
    { code: 'DE', dial: '+49' }
  ];
  countries = ['France', 'United States', 'United Kingdom', 'Spain', 'Germany', 'Italy'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private experienceService: ExperienceService,
    private bookingService: BookingService,
    public auth: AuthService,
    private idEncrypt: IdEncryptService
  ) {}

  ngOnInit(): void {
    const encryptedId = this.route.snapshot.paramMap.get('encryptedId');
    const id = encryptedId ? this.idEncrypt.decryptId(encryptedId) : 0;
    const q = this.route.snapshot.queryParams;
    this.selectedDate = q['date'] ?? '';
    this.selectedTime = q['time'] ?? '';
    this.adultsCount = Number(q['guests'] ?? 1);
    // Re-select addons passed from booking sidebar
    if (q['addons']) {
      const selectedIds = q['addons'].split(',').map(Number).filter(Boolean);
      this._pendingAddonIds = selectedIds;
    }

    if (id) {
      this.loading = true;
      this.experienceService.get(id).subscribe({
        next: (exp) => { this.experience = exp; this.loading = false; },
        error: () => { this.loading = false; }
      });
    }

    const user = this.auth.user();
    if (user) {
      const parts = user.name?.split(' ') ?? [];
      this.firstName = parts[0] ?? '';
      this.lastName = parts.slice(1).join(' ');
      this.email = user.email;
    }
  }

  get baseTotal(): number { return (Number(this.experience?.base_price) ?? 0) * this.adultsCount; }
  get serviceFee(): number { return Math.round(this.baseTotal * 0.1); }
  get taxes(): number { return Math.round((this.baseTotal + this.serviceFee) * 0.2 * 100) / 100; }
  get total(): number { return this.baseTotal + this.serviceFee + this.taxes; }

  incrementAdults(): void { this.adultsCount++; }
  decrementAdults(): void { if (this.adultsCount > 1) this.adultsCount--; }

  continueToPayment(): void {
    this.validationErrors = {};
    this.bookingError = '';

    // Inline validation — no alert()
    if (!this.firstName)    this.validationErrors['firstName'] = 'Required';
    if (!this.lastName)     this.validationErrors['lastName'] = 'Required';
    if (!this.email)        this.validationErrors['email'] = 'Required';
    if (!this.phoneNumber)  this.validationErrors['phoneNumber'] = 'Required';
    if (!this.selectedDate) this.validationErrors['date'] = 'Please select a date';
    if (!this.selectedTime) this.validationErrors['time'] = 'Please select a time slot';
    if (!this.acceptTerms)  this.validationErrors['terms'] = 'Please accept the terms to continue';

    if (Object.keys(this.validationErrors).length > 0) return;

    this.submitting = true;

    const bookingPayload: any = {
      experience: this.experience!.id,
      guide: this.experience!.guide,
      date: this.selectedDate,
      time: this.formatTime(this.selectedTime) || '09:00:00',
      adults: this.adultsCount,
      children: this.childrenCount,
      base_price: this.experience!.base_price,
      addons_total: 0,
      subtotal: this.baseTotal,
      service_fee: this.serviceFee,
      taxes: this.taxes,
      total_amount: this.total
    };

    this.bookingService.create(bookingPayload).subscribe({
      next: (booking) => {
        this.bookingRef = booking.booking_ref;
        // Save traveler details against the booking
        this.bookingService.createDetail({
          booking: booking.id,
          first_name: this.firstName,
          last_name: this.lastName,
          email: this.email,
          phone_code: this.phoneCode,
          phone_number: this.phoneNumber,
          country: this.country,
          special_requests: this.specialRequests,
          accept_terms: this.acceptTerms,
          receive_updates: this.receiveUpdates,
        }).subscribe(); // fire-and-forget — don't block confirmation
        this.submitting = false;
        this.currentStep = 3;
      },
      error: (err) => {
        this.bookingError = err.error?.detail ?? Object.values(err.error ?? {})[0] as string ?? 'Booking failed. Please try again.';
        this.submitting = false;
      }
    });
  }

  formatTime(time: string): string {
    if (!time) return '09:00:00';
    time = time.trim();
    // Already HH:MM:SS
    if (/^\d{1,2}:\d{2}:\d{2}$/.test(time)) return time;
    // HH:MM → HH:MM:00
    if (/^\d{1,2}:\d{2}$/.test(time)) {
      const [h, m] = time.split(':');
      return `${h.padStart(2, '0')}:${m}:00`;
    }
    // "9:00 AM" / "10:00 PM" → HH:MM:00
    const match = time.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (match) {
      let hours = parseInt(match[1], 10);
      const minutes = match[2];
      const period = match[3].toUpperCase();
      if (period === 'AM' && hours === 12) hours = 0;
      if (period === 'PM' && hours !== 12) hours += 12;
      return `${String(hours).padStart(2, '0')}:${minutes}:00`;
    }
    return '09:00:00';
  }

  showPolicyModal = false;

  goToReservations(): void { this.router.navigate(['/client/reservations']); }
  applyPromoCode(): void { /* promo codes not yet implemented */ }
  viewCancellationPolicy(event: Event): void { event.preventDefault(); this.showPolicyModal = true; }
  closePolicyModal(): void { this.showPolicyModal = false; }

  cancellationWindowLabel(code: string): string {
    return ({ '24-hours': '24 hours', '48-hours': '48 hours', '72-hours': '72 hours' } as any)[code] ?? code;
  }

  lateArrivalLabel(code: string): string {
    return ({
      'wait-15':      'We wait up to 15 minutes for late arrivals.',
      'start-on-time': 'The experience starts on time. Late arrivals join at the current point in the tour.',
      'custom':       'Please contact the guide for late arrival details.',
    } as any)[code] ?? code;
  }

  noShowLabel(code: string): string {
    return ({
      'no-refund':      'No-shows are non-refundable.',
      'partial-refund': 'A partial refund may be issued for no-shows at the guide\'s discretion.',
      'custom':         'Please contact the guide for no-show details.',
    } as any)[code] ?? code;
  }

  weatherLabel(code: string): string {
    return ({
      'light-rain':       'The experience runs in light rain. No cancellation for minor weather.',
      'cancel-bad':       'The experience is cancelled in case of bad weather, with a full refund.',
      'reschedule-severe': 'The experience will be rescheduled in case of severe weather.',
    } as any)[code] ?? code;
  }
  setAccountOption(option: 'signin' | 'guest'): void { this.accountOption = option; }
  removeAddon(_id: string): void {}
}
