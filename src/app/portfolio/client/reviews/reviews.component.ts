import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ClientHeaderComponent } from '../client-header/client-header.component';
import { ReviewService } from '../../../core/services/review.service';
import { IdEncryptService } from '../../../core/services/id-encrypt.service';
import { Review } from '../../../core/models';

@Component({
  selector: 'app-client-reviews',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ClientHeaderComponent],
  templateUrl: './reviews.component.html',
  styleUrl: './reviews.component.scss'
})
export class ClientReviewsComponent implements OnInit {
  reviews: Review[] = [];
  loading = false;
  error = '';
  searchQuery = '';
  selectedRating: number | null = null;

  ratingStats = {
    average: 0,
    total: 0,
    distribution: [
      { stars: 5, count: 0 },
      { stars: 4, count: 0 },
      { stars: 3, count: 0 },
      { stars: 2, count: 0 },
      { stars: 1, count: 0 }
    ]
  };

  constructor(
    private reviewService: ReviewService,
    public router: Router,
    private idEncrypt: IdEncryptService
  ) {}

  ngOnInit(): void {
    this.loadReviews();
  }

  private loadReviews(): void {
    this.loading = true;
    this.reviewService.list({ mine: true }).subscribe({
      next: (res) => {
        this.reviews = res.results;
        this.buildStats(res.results);
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load reviews';
        this.loading = false;
      }
    });
  }

  private buildStats(reviews: Review[]): void {
    const total = reviews.length;
    const avg = total ? reviews.reduce((s, r) => s + r.rating, 0) / total : 0;
    this.ratingStats.average = Math.round(avg * 10) / 10;
    this.ratingStats.total = total;

    this.ratingStats.distribution.forEach(dist => {
      dist.count = reviews.filter(r => r.rating === dist.stars).length;
    });
  }

  get filteredReviews(): Review[] {
    return this.reviews.filter(r => {
      const matchesSearch = !this.searchQuery ||
        r.customer_name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        r.content.toLowerCase().includes(this.searchQuery.toLowerCase());

      const matchesRating = !this.selectedRating || r.rating === this.selectedRating;

      return matchesSearch && matchesRating;
    });
  }

  deleteReview(id: number): void {
    if (!confirm('Are you sure you want to delete this review?')) return;

    this.reviewService.delete(id).subscribe({
      next: () => {
        this.reviews = this.reviews.filter(r => r.id !== id);
        this.buildStats(this.reviews);
      },
      error: () => {
        alert('Failed to delete review');
      }
    });
  }

  filterByRating(stars: number): void {
    this.selectedRating = this.selectedRating === stars ? null : stars;
  }

  viewExperience(experienceId: number): void {
    const encryptedId = this.idEncrypt.encryptId(experienceId);
    this.router.navigate(['/landing/experience', encryptedId]);
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  getStarArray(rating: number): number[] {
    return Array.from({ length: 5 }, (_, i) => i < rating ? 1 : 0);
  }

  roundRating(rating: number): number {
    return Math.round(rating);
  }
}
