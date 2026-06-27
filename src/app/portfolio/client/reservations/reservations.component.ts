import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ClientHeaderComponent } from '../client-header/client-header.component';
import { BookingService } from '../../../core/services/booking.service';
import { ReviewService } from '../../../core/services/review.service';
import { IdEncryptService } from '../../../core/services/id-encrypt.service';
import { Booking } from '../../../core/models';

type ReservationTab = 'upcoming' | 'past' | 'cancelled' | 'disputes';

@Component({
  selector: 'app-client-reservations',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ClientHeaderComponent],
  templateUrl: './reservations.component.html',
  styleUrl: './reservations.component.scss'
})
export class ClientReservationsComponent implements OnInit {
  activeTab: ReservationTab = 'upcoming';
  allBookings: Booking[] = [];
  loading = false;

  tabs: { key: ReservationTab; label: string; count: number }[] = [
    { key: 'upcoming', label: 'Upcoming', count: 0 },
    { key: 'past',     label: 'Past',     count: 0 },
    { key: 'cancelled', label: 'Cancelled', count: 0 },
    { key: 'disputes', label: 'Disputes', count: 0 }
  ];

  // Cancel confirmation modal state
  cancelModalOpen = false;
  cancelTarget: Booking | null = null;
  cancelling = false;

  // Review modal state
  reviewModalOpen = false;
  reviewTarget: Booking | null = null;
  reviewRating = 0;
  reviewContent = '';
  reviewSubmitting = false;
  reviewError = '';

  constructor(
    private bookingService: BookingService,
    private reviewService: ReviewService,
    private idEncrypt: IdEncryptService,
    private router: Router,
  ) {}

  encryptedExperienceId(id: number): string {
    return this.idEncrypt.encryptId(id);
  }

  encryptedGuideId(id: number): string {
    return this.idEncrypt.encryptId(id);
  }

  ngOnInit(): void {
    this.loading = true;
    this.bookingService.list().subscribe({
      next: (res) => {
        this.allBookings = res.results;
        this.updateTabCounts();
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  private updateTabCounts(): void {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    this.tabs[0].count = this.allBookings.filter(b =>
      (b.status === 'Confirmed' || b.status === 'Pending') && new Date(b.date) >= today
    ).length;
    this.tabs[1].count = this.allBookings.filter(b =>
      b.status === 'Confirmed' && new Date(b.date) < today
    ).length;
    this.tabs[2].count = this.allBookings.filter(b => b.status === 'Cancelled').length;
    this.tabs[3].count = this.allBookings.filter(b => b.status === 'Disputed').length;
  }

  setActiveTab(tab: ReservationTab): void {
    this.activeTab = tab;
  }

  get filteredReservations(): Booking[] {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    switch (this.activeTab) {
      case 'upcoming':
        return this.allBookings.filter(b =>
          (b.status === 'Confirmed' || b.status === 'Pending') && new Date(b.date) >= today
        );
      case 'past':
        return this.allBookings.filter(b =>
          b.status === 'Confirmed' && new Date(b.date) < today
        );
      case 'cancelled':
        return this.allBookings.filter(b => b.status === 'Cancelled');
      case 'disputes':
        return this.allBookings.filter(b => b.status === 'Disputed');
      default:
        return [];
    }
  }

  cancelBooking(booking: Booking): void {
    this.cancelTarget = booking;
    this.cancelModalOpen = true;
  }

  closeCancelModal(): void {
    this.cancelModalOpen = false;
    this.cancelTarget = null;
    this.cancelling = false;
  }

  confirmCancel(): void {
    if (!this.cancelTarget) return;
    this.cancelling = true;
    this.bookingService.cancel(this.cancelTarget.id).subscribe({
      next: () => {
        this.cancelTarget!.status = 'Cancelled';
        this.updateTabCounts();
        this.closeCancelModal();
      },
      error: () => { this.cancelling = false; }
    });
  }

  goToSupport(): void { this.router.navigate(['/admin/support']); }
  goToFAQs(): void { this.router.navigate(['/admin/support']); }

  openReviewModal(booking: Booking): void {
    this.reviewTarget = booking;
    this.reviewRating = 0;
    this.reviewContent = '';
    this.reviewError = '';
    this.reviewModalOpen = true;
  }

  closeReviewModal(): void {
    this.reviewModalOpen = false;
    this.reviewTarget = null;
  }

  submitReview(): void {
    if (!this.reviewTarget || !this.reviewContent.trim() || this.reviewRating === 0) return;
    this.reviewSubmitting = true;
    this.reviewError = '';
    this.reviewService.create({
      experience: this.reviewTarget.experience,
      guide: this.reviewTarget.guide,
      rating: this.reviewRating,
      content: this.reviewContent,
    }).subscribe({
      next: () => {
        this.reviewSubmitting = false;
        this.closeReviewModal();
      },
      error: () => {
        this.reviewError = 'Failed to submit review. Please try again.';
        this.reviewSubmitting = false;
      }
    });
  }
}
