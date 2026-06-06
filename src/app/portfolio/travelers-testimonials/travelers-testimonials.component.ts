import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReviewService } from '../../core/services/review.service';

interface Testimonial {
  id: number;
  name: string;
  location: string;
  text: string;
  rating: number;
  avatar: string;
}

@Component({
  selector: 'app-travelers-testimonials',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './travelers-testimonials.component.html',
  styleUrl: './travelers-testimonials.component.scss'
})
export class TravelersTestimonialsComponent implements OnInit {
  testimonials: Testimonial[] = [];
  loading = true;

  constructor(private reviewService: ReviewService) {}

  ngOnInit(): void {
    this.reviewService.list({ page: 1 }).subscribe({
      next: (res) => {
        this.testimonials = res.results.slice(0, 3).map(r => ({
          id: r.id,
          name: (r as any).customer_name ?? 'Traveler',
          location: 'Paris visitor',
          text: r.content,
          rating: r.rating,
          avatar: (r as any).customer_avatar ?? 'assets/images/avatar/sophie.png',
        }));
        // If no reviews yet, keep tasteful fallbacks
        if (this.testimonials.length === 0) {
          this.testimonials = [
            { id: 1, name: 'Sarah Johnson', location: 'New York, USA', text: 'An unforgettable experience! Our guide showed us hidden corners of Paris we never would have found on our own.', rating: 5, avatar: 'assets/images/avatar/sophie.png' },
            { id: 2, name: 'Marco Rossi', location: 'Milan, Italy', text: 'The food tour was incredible. We tasted authentic French cuisine and learned so much about the culture.', rating: 5, avatar: 'assets/images/avatar/sophie.png' },
            { id: 3, name: 'Lisa Chen', location: 'Singapore', text: 'Perfect for families! Our kids loved the interactive tour and the guide was so patient and knowledgeable.', rating: 5, avatar: 'assets/images/avatar/sophie.png' },
          ];
        }
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }
}
