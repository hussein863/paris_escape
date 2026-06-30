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
  filters = ['All', '5 stars', '4 stars', '3 stars', '2 stars', '1 star', 'Critical', 'With photos'];

  setFilter(filter: string): void {
    this.activeFilter = filter.toLowerCase();
  }

  countFor(filter: string): number {
    switch (filter.toLowerCase()) {
      case '5 stars':    return this.reviews.filter(r => r.rating === 5).length;
      case '4 stars':    return this.reviews.filter(r => r.rating === 4).length;
      case '3 stars':    return this.reviews.filter(r => r.rating === 3).length;
      case '2 stars':    return this.reviews.filter(r => r.rating === 2).length;
      case '1 star':     return this.reviews.filter(r => r.rating === 1).length;
      case 'critical':   return this.reviews.filter(r => r.rating <= 2).length;
      case 'with photos': return this.reviews.filter(r => (r.photos?.length ?? 0) > 0).length;
      default:           return this.reviews.length;
    }
  }

  get filteredReviews(): Review[] {
    switch (this.activeFilter) {
      case '5 stars':    return this.reviews.filter(r => r.rating === 5);
      case '4 stars':    return this.reviews.filter(r => r.rating === 4);
      case '3 stars':    return this.reviews.filter(r => r.rating === 3);
      case '2 stars':    return this.reviews.filter(r => r.rating === 2);
      case '1 star':     return this.reviews.filter(r => r.rating === 1);
      case 'critical':   return this.reviews.filter(r => r.rating <= 2);
      case 'with photos': return this.reviews.filter(r => (r.photos?.length ?? 0) > 0);
      default:           return this.reviews;
    }
  }

  getStars(rating: number): number[] {
    return Array(rating).fill(0);
  }

  getInitials(name: string): string {
    const parts = name.trim().split(' ');
    return (parts[0][0] + (parts[1]?.[0] ?? '')).toUpperCase();
  }

  loadMore(): void {}
}
