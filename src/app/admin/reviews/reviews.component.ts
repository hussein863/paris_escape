import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { AdminHeaderComponent } from '../header/admin-header.component';
import { ReviewService } from '../../core/services/review.service';
import { ExperienceService } from '../../core/services/experience.service';
import { AuthService } from '../../core/services/auth.service';
import { Review } from '../../core/models';

@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent, AdminHeaderComponent],
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.scss']
})
export class ReviewsComponent implements OnInit {
  isSidebarOpen = false;
  loading = true;

  // â”€â”€â”€ Raw data â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  allReviews: Review[] = [];
  experiences: { id: number; title: string }[] = [];

  // â”€â”€â”€ Filters â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  searchQuery = '';
  filterRating = 0;          // 0 = all
  filterExperience = 0;      // 0 = all
  filterReply = 'all';       // 'all' | 'replied' | 'not_replied'
  filterPill = 'all';        // 'all' | 'photos' | 'not_replied' | 'last30'
  sortBy = 'newest';

  // â”€â”€â”€ Inline reply state â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  replyingToId: number | null = null;
  replyDraft = '';
  replySaving = false;

  editingReplyId: number | null = null;  // review id whose reply is being edited
  editDraft = '';
  editSaving = false;

  constructor(
    private reviewService: ReviewService,
    private experienceService: ExperienceService,
    private auth: AuthService,
  ) {}

  ngOnInit(): void {
    const guideId = this.auth.user()?.guide_profile?.id;
    if (guideId) {
      this.reviewService.list({ guide: guideId }).subscribe({
        next: (res) => {
          this.allReviews = res.results;
          this.loading = false;
        },
        error: () => { this.loading = false; }
      });
    } else {
      this.loading = false;
    }

    this.experienceService.list({ mine: true }).subscribe({
      next: (res) => {
        this.experiences = res.results.map(e => ({ id: e.id, title: e.title }));
      }
    });
  }

  // â”€â”€â”€ Computed / filtered list â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  get filteredReviews(): Review[] {
    let list = [...this.allReviews];

    // Search
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      list = list.filter(r =>
        (r as any).customer_name?.toLowerCase().includes(q) ||
        r.content.toLowerCase().includes(q)
      );
    }

    // Rating
    if (this.filterRating > 0) list = list.filter(r => r.rating === this.filterRating);

    // Experience
    if (this.filterExperience > 0) list = list.filter(r => r.experience === this.filterExperience);

    // Reply status
    if (this.filterReply === 'replied')     list = list.filter(r => !!r.reply);
    if (this.filterReply === 'not_replied') list = list.filter(r => !r.reply);

    // Pill
    if (this.filterPill === 'photos')      list = list.filter(r => r.photos?.length > 0);
    if (this.filterPill === 'not_replied') list = list.filter(r => !r.reply);
    if (this.filterPill === 'last30') {
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - 30);
      list = list.filter(r => new Date(r.date) >= cutoff);
    }

    // Sort
    if (this.sortBy === 'newest')  list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    if (this.sortBy === 'oldest')  list.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    if (this.sortBy === 'highest') list.sort((a, b) => b.rating - a.rating);
    if (this.sortBy === 'lowest')  list.sort((a, b) => a.rating - b.rating);

    return list;
  }

  // â”€â”€â”€ Statistics (computed from real data) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  get totalReviews(): number { return this.allReviews.length; }

  get overallRating(): number {
    if (!this.allReviews.length) return 0;
    const sum = this.allReviews.reduce((acc, r) => acc + r.rating, 0);
    return Math.round((sum / this.allReviews.length) * 10) / 10;
  }

  get ratingDistribution(): { stars: number; count: number; percentage: number }[] {
    return [5, 4, 3, 2, 1].map(stars => {
      const count = this.allReviews.filter(r => r.rating === stars).length;
      return { stars, count, percentage: this.totalReviews ? Math.round((count / this.totalReviews) * 100) : 0 };
    });
  }

  get photosCount(): number { return this.allReviews.filter(r => r.photos?.length > 0).length; }
  get photosPercentage(): number { return this.totalReviews ? Math.round((this.photosCount / this.totalReviews) * 100) : 0; }
  get repliedCount(): number { return this.allReviews.filter(r => !!r.reply).length; }
  get repliedPercentage(): number { return this.totalReviews ? Math.round((this.repliedCount / this.totalReviews) * 100) : 0; }

  get starArray(): number[] { return [1, 2, 3, 4, 5]; }
  filledStars(rating: number): number[] { return Array(Math.round(rating)).fill(0); }
  emptyStars(rating: number): number[] { return Array(5 - Math.round(rating)).fill(0); }

  // â”€â”€â”€ Reply actions â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  startReply(reviewId: number): void {
    this.replyingToId = reviewId;
    this.replyDraft = '';
    this.editingReplyId = null;
  }

  cancelReply(): void { this.replyingToId = null; this.replyDraft = ''; }

  submitReply(review: Review): void {
    if (!this.replyDraft.trim()) return;
    this.replySaving = true;
    this.reviewService.reply(review.id, this.replyDraft).subscribe({
      next: (reply) => {
        review.reply = reply;
        this.replyingToId = null;
        this.replyDraft = '';
        this.replySaving = false;
      },
      error: () => { this.replySaving = false; }
    });
  }

  startEditReply(review: Review): void {
    this.editingReplyId = review.id;
    this.editDraft = review.reply?.content ?? '';
    this.replyingToId = null;
  }

  cancelEdit(): void { this.editingReplyId = null; this.editDraft = ''; }

  submitEdit(review: Review): void {
    if (!review.reply?.id || !this.editDraft.trim()) return;
    this.editSaving = true;
    this.reviewService.updateReply(review.reply.id, this.editDraft).subscribe({
      next: (updated) => {
        review.reply = updated;
        this.editingReplyId = null;
        this.editDraft = '';
        this.editSaving = false;
      },
      error: () => { this.editSaving = false; }
    });
  }

  // â”€â”€â”€ Other actions â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  getInitial(review: Review): string {
    return ((review as any).customer_name as string)?.charAt(0)?.toUpperCase() || '?';
  }

  getCustomerName(review: Review): string {
    return (review as any).customer_name || 'Anonymous';
  }

  toggleSidebar(): void { this.isSidebarOpen = !this.isSidebarOpen; }
  closeSidebar(): void { this.isSidebarOpen = false; }

  setFilterPill(pill: string): void { this.filterPill = pill; }

  exportCSV(): void {
    const rows = ['Customer,Rating,Date,Experience,Content'];
    this.filteredReviews.forEach(r => {
      rows.push(`"${(r as any).customer_name || r.customer}","${r.rating}","${r.date}","${r.experience}","${r.content.replace(/"/g, '""')}"`);
    });
    const blob = new Blob([rows.join('\n')], { type: 'text/csv' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'reviews.csv'; a.click();
  }
}
