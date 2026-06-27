import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Review } from '../guide-profile.component';

interface ReviewStats {
  average: number;
  total: number;
  distribution: { stars: number; count: number }[];
}

@Component({
  selector: 'app-profile-reviews',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile-reviews.component.html',
  styleUrl: './profile-reviews.component.scss'
})
export class ProfileReviewsComponent {
  @Input() reviews: Review[] = [];
  @Input() stats!: ReviewStats;
  @Input() canReview: boolean = false;
  @Input() isLoggedIn: boolean = false;

  @Output() writeReviewClicked = new EventEmitter<void>();
  @Output() reportClicked = new EventEmitter<void>();

  selectedFilter = 'all';
  filters = ['All', '5 stars', '4 stars', 'Louvre Tour', 'Montmartre Tour', 'Food Tour'];

  getStars(rating: number): number[] {
    return Array(5).fill(0).map((_, i) => i < rating ? 1 : 0);
  }

  getBarWidth(count: number): number {
    const max = Math.max(...this.stats.distribution.map(d => d.count), 1);
    return (count / max) * 100;
  }

  selectFilter(filter: string): void {
    this.selectedFilter = filter.toLowerCase();
  }
}
