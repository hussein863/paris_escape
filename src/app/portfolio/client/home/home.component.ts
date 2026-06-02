import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ClientHeaderComponent } from '../client-header/client-header.component';

interface Stat {
  icon: string;
  value: number;
  label: string;
  subtitle: string;
}

interface Reservation {
  title: string;
  date: string;
  time: string;
  guide: string;
  status: 'Confirmed' | 'Pending';
  imageUrl: string;
}

interface Message {
  name: string;
  avatar: string;
  message: string;
  time: string;
  unread: boolean;
}

interface Task {
  title: string;
  description: string;
  completed: boolean;
}

interface Experience {
  title: string;
  duration: string;
  rating: number;
  reviews: number;
  price: number;
  imageUrl: string;
  isFavorite?: boolean;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, ClientHeaderComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  userName = 'Sophie';

  stats: Stat[] = [
    { icon: 'fa-calendar-check', value: 2, label: 'Upcoming Trips', subtitle: 'Next: Dec 14, 2024' },
    { icon: 'fa-message', value: 3, label: 'Unread Messages', subtitle: 'From 2 guides' },
    { icon: 'fa-heart', value: 12, label: 'Saved Items', subtitle: '7 tours, 5 guides' },
    { icon: 'fa-clock-rotate-left', value: 0, label: 'Last Viewed', subtitle: 'Montmartre Walking Tour' }
  ];

  reservations: Reservation[] = [
    {
      title: 'Private Louvre Masterpieces Tour',
      date: 'Saturday, December 14, 2024',
      time: '10:00 AM',
      guide: 'Marie Dubois',
      status: 'Confirmed',
      imageUrl: 'assets/images/7f12ea1300756f144a0fb5daaf68dbfc01103a46.png'
    },
    {
      title: 'Montmartre Artists\' Quarter Walk',
      date: 'Sunday, December 22, 2024',
      time: '2:00 PM',
      guide: 'Pierre Martin',
      status: 'Pending',
      imageUrl: 'assets/images/7f12ea1300756f144a0fb5daaf68dbfc01103a46.png'
    }
  ];

  messages: Message[] = [
    {
      name: 'Marie Dubois',
      avatar: 'assets/images/avatar/emma.png',
      message: 'Looking forward to showing you the Louvre! I\'ll meet you at...',
      time: '2h ago',
      unread: true
    },
    {
      name: 'Pierre Martin',
      avatar: 'assets/images/avatar/james.png',
      message: 'Confirmed! I\'ve received your booking for the Montmartre tour...',
      time: '5h ago',
      unread: true
    },
    {
      name: 'Isabelle Rousseau',
      avatar: 'assets/images/avatar/lisa.png',
      message: 'Thank you for your interest! I have availability on those dates...',
      time: '1d ago',
      unread: true
    }
  ];

  tasks: Task[] = [
    { title: 'Complete your profile', description: 'Add more details to personalize your experience', completed: false },
    { title: 'Add payment method', description: 'Save a card for faster checkout', completed: false },
    { title: 'Add emergency contact', description: 'For your safety during tours', completed: false }
  ];

  favorites: Experience[] = [
    {
      title: 'Seine Sunset Cruise',
      duration: '2 hours',
      rating: 4.9,
      reviews: 234,
      price: 45,
      imageUrl: 'assets/images/card_image/seine-sunset.png',
      isFavorite: true
    },
    {
      title: 'French Pastry Workshop',
      duration: '3 hours',
      rating: 5.0,
      reviews: 187,
      price: 95,
      imageUrl: 'assets/images/card_image/pastry-workshop.png',
      isFavorite: true
    },
    {
      title: 'Versailles Palace & Gardens',
      duration: '6 hours',
      rating: 4.8,
      reviews: 421,
      price: 120,
      imageUrl: 'assets/images/card_image/seine.png',
      isFavorite: true
    }
  ];

  recentlyViewed: Experience[] = [
    {
      title: 'Latin Quarter Literary Walk',
      duration: '2h',
      rating: 4.7,
      reviews: 156,
      price: 35,
      imageUrl: 'assets/images/card_image/latin-quarter.png'
    },
    {
      title: 'Marais Fashion & Design Tour',
      duration: '3h',
      rating: 4.9,
      reviews: 203,
      price: 55,
      imageUrl: 'assets/images/c513568b90b8e50331ad90c9c0bb684d3cd18510.png'
    },
    {
      title: 'Paris Street Food Adventure',
      duration: '3h',
      rating: 4.8,
      reviews: 289,
      price: 75,
      imageUrl: 'assets/images/card_image/food-market.png'
    }
  ];

  moods = [
    { icon: 'fa-heart', label: 'Romantic' },
    { icon: 'fa-users', label: 'Family' },
    { icon: 'fa-utensils', label: 'Food' },
    { icon: 'fa-camera', label: 'Photo' },
    { icon: 'fa-palette', label: 'Culture' }
  ];

  removeTask(index: number): void {
    this.tasks.splice(index, 1);
  }

  toggleFavorite(experience: Experience): void {
    experience.isFavorite = !experience.isFavorite;
  }
}
