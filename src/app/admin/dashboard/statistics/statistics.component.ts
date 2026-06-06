import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { BookingService } from '../../../core/services/booking.service';
import { MessagingService } from '../../../core/services/messaging.service';
import { ExperienceService } from '../../../core/services/experience.service';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.scss',
})
export class StatisticsComponent implements OnInit {
  guideName = '';

  // Stat cards
  profileViews = 0;
  profileViewsChange = '';
  contactsUsed = 0;
  contactsTotal = 50;
  reservationsThisMonth = 0;
  reservationsChange = '';
  avgRating = 0;
  reviewCount = 0;

  // Business funnel
  funnelViews = 0;
  funnelContacts = 0;
  funnelBookings = 0;
  funnelCompleted = 0;

  // Messages panel
  recentConversations: any[] = [];
  unreadCount = 0;

  // Calendar/schedule
  upcomingBookings: any[] = [];

  loading = true;

  constructor(
    private auth: AuthService,
    private bookingService: BookingService,
    private messagingService: MessagingService,
    private experienceService: ExperienceService,
  ) {}

  ngOnInit(): void {
    const user = this.auth.user();
    this.guideName = user?.name?.split(' ')[0] ?? 'there';

    // Rating & review count from guide profile
    const guide = user?.guide_profile;
    if (guide) {
      this.avgRating = guide.rating ?? 0;
      this.reviewCount = guide.review_count ?? 0;
    }

    this.loadExperienceStats();
    this.loadBookingStats();
    this.loadMessagingStats();
  }

  private loadExperienceStats(): void {
    this.experienceService.list().subscribe({
      next: (res) => {
        // Sum views across all guide's experiences
        const total = res.results.reduce((acc, e) => acc + (e.views ?? 0), 0);
        this.profileViews = total;
        this.funnelViews = total;
      }
    });
  }

  private loadBookingStats(): void {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    this.bookingService.list().subscribe({
      next: (res) => {
        const allBookings = res.results;

        // Reservations this month
        const thisMonth = allBookings.filter(b =>
          new Date(b.date) >= monthStart
        );
        this.reservationsThisMonth = thisMonth.length;
        this.funnelBookings = thisMonth.length;

        // Completed (past confirmed)
        this.funnelCompleted = allBookings.filter(b =>
          b.status === 'Confirmed' && new Date(b.date) < today
        ).length;

        // Upcoming 3 for calendar panel
        this.upcomingBookings = allBookings
          .filter(b => (b.status === 'Confirmed' || b.status === 'Pending') && new Date(b.date) >= today)
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
          .slice(0, 3);

        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  private loadMessagingStats(): void {
    this.messagingService.listConversations().subscribe({
      next: (res) => {
        this.recentConversations = res.results.slice(0, 2);
        this.unreadCount = res.results.filter((c: any) => c.unread_count > 0).length;
        this.contactsUsed = res.count;
        this.funnelContacts = res.count;
      }
    });
  }

  formatBookingDate(dateStr: string, timeStr?: string): string {
    const d = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    let label: string;
    if (d.toDateString() === today.toDateString()) {
      label = 'Today';
    } else if (d.toDateString() === tomorrow.toDateString()) {
      label = 'Tomorrow';
    } else {
      label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
    return timeStr ? `${label}, ${timeStr}` : label;
  }

  get contactProgress(): number {
    return Math.round((this.contactsUsed / this.contactsTotal) * 100);
  }

  get funnelContactRate(): string {
    if (!this.funnelViews) return '0%';
    return ((this.funnelContacts / this.funnelViews) * 100).toFixed(1) + '%';
  }

  get funnelBookingRate(): string {
    if (!this.funnelContacts) return '0%';
    return ((this.funnelBookings / this.funnelContacts) * 100).toFixed(0) + '%';
  }

  get funnelCompletionRate(): string {
    if (!this.funnelBookings) return '0%';
    return ((this.funnelCompleted / this.funnelBookings) * 100).toFixed(0) + '%';
  }

  get ratingStars(): number[] {
    return [1, 2, 3, 4, 5];
  }

  isStarFilled(star: number): boolean {
    return star <= Math.round(this.avgRating);
  }
}
