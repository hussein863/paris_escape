import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Experience {
  id: string;
  title: string;
  guide: string;
  city: string;
  category: string;
  status: 'Draft' | 'Pending' | 'Published' | 'Refused';
  price: string;
}

interface Booking {
  id: string;
  customer: string;
  guide: string;
  dateTime: string;
  amount: string;
  status: 'Confirmed' | 'Canceled' | 'Pending';
}

interface Payment {
  id: string;
  type: string;
  user: string;
  amount: string;
  method: string;
  status: 'Paid' | 'Failed' | 'Pending';
}

interface Dispute {
  id: string;
  bookingId: string;
  reason: string;
  status: 'Open' | 'Resolved';
  evidence: string;
}

@Component({
  selector: 'app-business',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './business.component.html',
  styleUrl: './business.component.scss'
})
export class BusinessComponent {
  activeTab: 'experiences' | 'bookings' | 'payments' | 'disputes' = 'experiences';

  // Experiences data
  experiences: Experience[] = [
    { id: 'EXP001', title: 'Paris Night Tour', guide: 'Marie Dubois', city: 'Paris', category: 'Night Tours', status: 'Published', price: '€89' },
    { id: 'EXP002', title: 'Eiffel Tower Visit', guide: 'Jean Martin', city: 'Paris', category: 'Landmarks', status: 'Pending', price: '€120' },
    { id: 'EXP003', title: 'Louvre Masterclass', guide: 'Sophie Laurent', city: 'Paris', category: 'Museums', status: 'Draft', price: '€95' },
    { id: 'EXP004', title: 'Montmartre Walking', guide: 'Pierre Blanc', city: 'Paris', category: 'Walking Tours', status: 'Refused', price: '€65' }
  ];

  // Bookings data
  bookings: Booking[] = [
    { id: 'BKG001', customer: 'Alice Smith', guide: 'Marie Dubois', dateTime: '2024-03-15 14:00', amount: '€89', status: 'Confirmed' },
    { id: 'BKG002', customer: 'Bob Johnson', guide: 'Jean Martin', dateTime: '2024-03-16 10:00', amount: '€120', status: 'Pending' },
    { id: 'BKG003', customer: 'Carol White', guide: 'Sophie Laurent', dateTime: '2024-03-14 16:00', amount: '€95', status: 'Canceled' }
  ];

  // Payments data
  payments: Payment[] = [
    { id: 'PAY001', type: 'Booking', user: 'Alice Smith', amount: '€89', method: 'Stripe', status: 'Paid' },
    { id: 'PAY002', type: 'Commission', user: 'Marie Dubois', amount: '€17.8', method: 'Bank Transfer', status: 'Paid' },
    { id: 'PAY003', type: 'Subscription', user: 'Jean Martin', amount: '€29', method: 'Stripe', status: 'Failed' }
  ];

  // Disputes data
  disputes: Dispute[] = [
    { id: 'DIS001', bookingId: 'BKG003', reason: 'Service not as described', status: 'Open', evidence: '3 files' },
    { id: 'DIS002', bookingId: 'BKG001', reason: 'Late cancellation', status: 'Resolved', evidence: '1 file' }
  ];

  filterStatus = '';
  filterCity = '';
  filterCategory = '';

  setActiveTab(tab: 'experiences' | 'bookings' | 'payments' | 'disputes'): void {
    this.activeTab = tab;
  }

  publishExperience(exp: Experience): void {
    exp.status = 'Published';
  }

  refuseExperience(exp: Experience): void {
    exp.status = 'Refused';
  }

  refundBooking(booking: Booking): void {
    alert(`Refunding booking ${booking.id}...`);
  }

  retryPayment(payment: Payment): void {
    alert(`Retrying payment ${payment.id}...`);
  }

  resolveDispute(dispute: Dispute): void {
    dispute.status = 'Resolved';
  }
}
