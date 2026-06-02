import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../sidebar/sidebar.component';

interface Review {
  id: string;
  userName: string;
  userAvatar: string;
  verified: boolean;
  language: string;
  rating: number;
  date: string;
  experienceName: string;
  content: string;
  photos: string[];
  helpful: number;
  hasReply?: boolean;
  reply?: {
    userName: string;
    userAvatar: string;
    date: string;
    lastEdited?: string;
    content: string;
  };
}

@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [CommonModule, SidebarComponent],
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.scss']
})
export class ReviewsComponent {
  isSidebarOpen = false;

  overallRating = 4.8;
  totalReviews = 247;
  photosCount = 142;
  photosPercentage = 57;
  repliedCount = 220;
  repliedPercentage = 89;

  ratingDistribution = [
    { stars: 5, count: 193, percentage: 78 },
    { stars: 4, count: 38, percentage: 15 },
    { stars: 3, count: 11, percentage: 4 },
    { stars: 2, count: 4, percentage: 2 },
    { stars: 1, count: 1, percentage: 1 }
  ];

  reviews: Review[] = [
    {
      id: '1',
      userName: 'Sophie Laurent',
      userAvatar: 'assets/images/ec901f1c0d6bdc3abb3b7f2578c96a444ee001e2.jpg',
      verified: true,
      language: 'EN',
      rating: 5,
      date: 'Nov 28, 2024',
      experienceName: 'Hidden Montmartre Walking Tour',
      content: 'Marie was an absolutely wonderful guide! She took us through hidden streets and shared fascinating stories about Montmartre\'s artistic history. The pace was perfect and she made sure everyone in our group felt included. Highly recommend this tour to anyone visiting Paris!',
      photos: ['assets/images/f364592883e6ae2b3c02e1dde22f3894eaeec260.png', 'assets/images/b7fffb001d550166022c90cb67afcd24fe29bf96.png', 'assets/images/21e8430110f69a55df6ab19658dab9d04698f3c6.png'],
      helpful: 12
    },
    {
      id: '2',
      userName: 'James Wilson',
      userAvatar: 'assets/images/1d5ad8aaf12fd61a75197f707f6ef40c7edd6e1f.jpg',
      verified: true,
      language: 'EN',
      rating: 5,
      date: 'Nov 26, 2024',
      experienceName: 'Latin Quarter Food Tour',
      content: 'Best food tour I\'ve ever taken! Marie knew all the best spots and the owners personally. Every stop was delicious and she explained the history behind each dish. Perfect for foodies!',
      photos: ['assets/images/b927b44c9a0bf7e6316e3fcfe1e5f3394ef01871.png', 'assets/images/56d0039694c4ad0d047af496ea41ba6870338762.png'],
      helpful: 6,
      hasReply: true,
      reply: {
        userName: 'Marie Dubois',
        userAvatar: 'assets/images/f578f9c2a181ef669150341163e63e6e9da01878.jpg',
        date: 'Nov 27, 2024',
        lastEdited: 'Nov 27, 2024',
        content: 'Thank you so much James! It was a pleasure showing you around the Latin Quarter. I\'m thrilled you enjoyed the food and the stories. Hope to see you again on another tour!'
      }
    }
  ];

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidebar() {
    this.isSidebarOpen = false;
  }

  exportCSV() {
    console.log('Export CSV');
  }

  exportPDF() {
    console.log('Export PDF');
  }

  askForReviews() {
    console.log('Ask for reviews');
  }

  viewAnalytics() {
    console.log('View analytics');
  }

  replyToReview(reviewId: string) {
    console.log('Reply to review:', reviewId);
  }

  translateReview(reviewId: string) {
    console.log('Translate review:', reviewId);
  }

  reportReview(reviewId: string) {
    console.log('Report review:', reviewId);
  }

  editReply(reviewId: string) {
    console.log('Edit reply:', reviewId);
  }

  markHelpful(reviewId: string) {
    const review = this.reviews.find(r => r.id === reviewId);
    if (review) {
      review.helpful += 1;
      console.log('Marked review as helpful:', reviewId);
    }
  }
}
