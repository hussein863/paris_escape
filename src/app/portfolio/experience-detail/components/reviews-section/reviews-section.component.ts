import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Review {
  author: string;
  avatar: string;
  rating: number;
  date: string;
  comment: string;
  photos?: string[];
  reply?: { content: string; date: string } | null;
}

@Component({
  selector: 'app-reviews-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reviews-section.component.html',
  styleUrl: './reviews-section.component.scss'
})
export class ReviewsSectionComponent {
  @Input() reviews: Review[] = [];
  @Input() averageRating: number = 0;
  @Input() totalReviews: number = 0;
  @Input() canReview: boolean = false;
  @Input() isLoggedIn: boolean = false;

  @Output() writeReviewClicked = new EventEmitter<void>();
  @Output() reportClicked = new EventEmitter<void>();

  activeFilter = 'all';
  filters = ['All', '5 stars', '4 stars', 'With photos'];

  setFilter(filter: string): void {
    this.activeFilter = filter.toLowerCase();
  }

  get filteredReviews(): Review[] {
    switch (this.activeFilter) {
      case '5 stars':    return this.reviews.filter(r => r.rating === 5);
      case '4 stars':    return this.reviews.filter(r => r.rating === 4);
      case 'with photos': return this.reviews.filter(r => (r.photos?.length ?? 0) > 0);
      default:           return this.reviews;
    }
  }

  getStars(rating: number): number[] {
    return Array(rating).fill(0);
  }

  loadMore(): void {}
}
