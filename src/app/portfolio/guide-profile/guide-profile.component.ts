import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileHeaderComponent } from './profile-header/profile-header.component';
import { ProfileAboutComponent } from './profile-about/profile-about.component';
import { ProfileLocationComponent } from './profile-location/profile-location.component';
import { ProfileExperiencesComponent } from './profile-experiences/profile-experiences.component';
import { ProfileReviewsComponent } from './profile-reviews/profile-reviews.component';
import { ProfileSidebarComponent } from './profile-sidebar/profile-sidebar.component';
import { ProfileSimilarGuidesComponent } from './profile-similar-guides/profile-similar-guides.component';
import { HeaderComponent } from "../header/header.component";
import { FooterComponent } from "../footer/footer.component";

export interface Guide {
  id: number;
  name: string;
  avatar: string;
  coverImage: string;
  isVerified: boolean;
  isOriginal: boolean;
  languages: { name: string; level: string }[];
  location: string;
  experience: string;
  rating: number;
  reviewCount: number;
  totalTours: number;
  priceRange: string;
  responseTime: string;
  about: string;
  specialties: string[];
  meetingPoint: {
    name: string;
    address: string;
  };
  pickupOptions: string;
  accessibility: string;
}

export interface Experience {
  id: number;
  title: string;
  description: string;
  image: string;
  duration: string;
  maxPeople: number;
  difficulty: string;
  included: string[];
  options?: { name: string; price: number }[];
  price: number;
  isFavorite: boolean;
  badge?: string;
}

export interface Review {
  id: number;
  author: string;
  avatar: string;
  rating: number;
  date: string;
  tourName: string;
  content: string;
}

export interface SimilarGuide {
  id: number;
  name: string;
  image: string;
  languages: string;
  rating: number;
  reviewCount: number;
  specialty: string;
}

@Component({
  selector: 'app-guide-profile',
  standalone: true,
  imports: [
    CommonModule,
    ProfileHeaderComponent,
    ProfileAboutComponent,
    ProfileLocationComponent,
    ProfileExperiencesComponent,
    ProfileReviewsComponent,
    ProfileSidebarComponent,
    ProfileSimilarGuidesComponent,
    HeaderComponent,
    FooterComponent
],
  templateUrl: './guide-profile.component.html',
  styleUrl: './guide-profile.component.scss'
})
export class GuideProfileComponent {
  guide: Guide = {
    id: 1,
    name: 'Sophie Laurent',
    avatar: 'assets/images/avatar/sophie.png',
    coverImage: 'assets/images/profil/bg.png',
    isVerified: true,
    isOriginal: true,
    languages: [
      { name: 'French', level: 'Native' },
      { name: 'English', level: 'Fluent' },
      { name: 'Spanish', level: 'Intermediate' }
    ],
    location: 'Paris, France',
    experience: '8 years',
    rating: 4.9,
    reviewCount: 487,
    totalTours: 1234,
    priceRange: '€65 - €150',
    responseTime: 'Within 2 hours',
    about: `Bonjour! I'm Sophie, a Parisian born and raised in the heart of Montmartre. For the past 8 years, I've been sharing my passion for Paris with travelers from around the world. My love for this city goes beyond the typical tourist spots – I want to show you the Paris that locals know and love.

I specialize in art history, gastronomy, and hidden gems that most guidebooks miss. Whether you're interested in exploring world-class museums, discovering secret gardens, or tasting the best croissants in the city, I'll create a personalized experience just for you.

My background in art history and years working in Parisian museums give me unique insights into the city's cultural treasures. I'm also a certified sommelier and love introducing visitors to French wine culture. Every tour I lead is designed to be engaging, informative, and most importantly, fun!`,
    specialties: ['Art & Museums', 'Food & Wine', 'Hidden Gems', 'Photography', 'History', 'Local Culture'],
    meetingPoint: {
      name: 'Primary Meeting Point',
      address: 'Place des Abbesses, 75018 Paris (Montmartre)'
    },
    pickupOptions: 'Hotel pickup available for private tours (+€20)',
    accessibility: 'Some tours wheelchair accessible. Contact for details.'
  };

  experiences: Experience[] = [
    {
      id: 1,
      title: 'Private Louvre Masterpieces Tour',
      description: 'Skip the crowds and discover the Louvre\'s greatest treasures with an art historian guide.',
      image: 'assets/images/card_image/louvre.png',
      duration: '3 hours',
      maxPeople: 6,
      difficulty: 'Easy',
      included: ['Skip-the-line tickets', 'Expert guide', 'Headsets'],
      options: [
        { name: 'Private tour upgrade', price: 30 },
        { name: 'Photography session', price: 50 }
      ],
      price: 85,
      isFavorite: false
    },
    {
      id: 2,
      title: 'Secret Montmartre & Artist Studios',
      description: 'Explore hidden courtyards, meet local artists, and discover the real Montmartre.',
      image: 'assets/images/card_image/montmartre.png',
      duration: '2.5 hours',
      maxPeople: 8,
      difficulty: 'Moderate',
      included: ['Artist studio visits', 'Wine tasting', 'Local snacks'],
      price: 95,
      isFavorite: true,
      badge: 'Originals'
    },
    {
      id: 3,
      title: 'Gourmet Food Market Tour',
      description: 'Taste your way through Paris\'s best markets with a certified sommelier.',
      image: 'assets/images/card_image/food-market.png',
      duration: '3 hours',
      maxPeople: 6,
      difficulty: 'Easy',
      included: ['Food tastings', 'Wine pairing', 'Recipe cards'],
      price: 110,
      isFavorite: false
    }
  ];

  reviews: Review[] = [
    {
      id: 1,
      author: 'Michael Chen',
      avatar: 'assets/images/avatar/james.png',
      rating: 5,
      date: '2 weeks ago',
      tourName: 'Private Louvre Masterpieces Tour',
      content: 'Sophie was absolutely fantastic! Her knowledge of art history brought the Louvre to life. She knew exactly which pieces to show us and shared fascinating stories. Highly recommend!'
    },
    {
      id: 2,
      author: 'Emma Williams',
      avatar: 'assets/images/avatar/emma.png',
      rating: 5,
      date: '1 month ago',
      tourName: 'Secret Montmartre & Artist Studios',
      content: 'This was the highlight of our Paris trip! Sophie showed us places we never would have found on our own. Meeting the local artists was incredible. The wine tasting was a perfect touch!'
    },
    {
      id: 3,
      author: 'Carlos Rodriguez',
      avatar: 'assets/images/avatar/michael.png',
      rating: 5,
      date: '2 months ago',
      tourName: 'Gourmet Food Market Tour',
      content: 'As a foodie, this tour exceeded all expectations. Sophie\'s wine expertise and connections with local vendors made this truly special. We tasted incredible cheeses, pastries, and wines!'
    }
  ];

  similarGuides: SimilarGuide[] = [
    {
      id: 1,
      name: 'Jean-Pierre Dubois',
      image: 'assets/images/card_image/person/jean-pierre.png',
      languages: 'FR, EN, IT',
      rating: 4.8,
      reviewCount: 312,
      specialty: 'History expert specializing in medieval Paris and royal palaces.'
    },
    {
      id: 2,
      name: 'Marie Dubois',
      image: 'assets/images/card_image/person/marie.png',
      languages: 'FR, EN, ES',
      rating: 4.7,
      reviewCount: 289,
      specialty: 'Specializes in Parisian street art and hidden photography spots.'
    },
    {
      id: 3,
      name: 'Lucas Moreau',
      image: 'assets/images/card_image/person/lucas.png',
      languages: 'FR, EN, DE',
      rating: 4.9,
      reviewCount: 412,
      specialty: 'Expert in Parisian architecture and historical landmarks.'
    },
    {
      id: 4,
      name: 'Sophie Moreau',
      image: 'assets/images/card_image/person/sophie-m.png',
      languages: 'FR, EN, IT',
      rating: 4.8,
      reviewCount: 356,
      specialty: 'Specializes in Parisian food culture and wine tasting.'
    }
  ];

  reviewStats = {
    average: 4.9,
    total: 487,
    distribution: [
      { stars: 5, count: 448 },
      { stars: 4, count: 29 },
      { stars: 3, count: 7 },
      { stars: 2, count: 2 },
      { stars: 1, count: 1 }
    ]
  };
}
