import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClientHeaderComponent } from "../client-header/client-header.component";

interface Guide {
  id: string;
  name: string;
  avatar: string;
  languages: string[];
  rating: number;
  reviewCount: number;
  description: string;
  verified?: boolean;
  badge?: string;
  available: boolean;
}

interface Experience {
  id: string;
  title: string;
  image: string;
  price: number;
  duration: string;
}

interface ViewedItem {
  title: string;
  price: number;
  duration: string;
  imageUrl: string;
}

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, FormsModule, ClientHeaderComponent],
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss']
})
export class FavoritesComponent {
  activeTab: 'guides' | 'experiences' = 'guides';
  searchQuery = '';
  sortBy = 'recently-added';

  selectedMoods: string[] = [];
  selectedLanguages: string[] = [];

  moods = ['Romantic', 'Family', 'Food', 'Photo', 'Culture'];
  languages = ['FR', 'EN', 'ES', 'AR'];

  guides: Guide[] = [
    {
      id: '1',
      name: 'Marie Dubois',
      avatar: 'assets/images/avatar/sophie.png',
      languages: ['FR', 'EN', 'ES'],
      rating: 5,
      reviewCount: 127,
      description: 'Art historian specializing in Louvre and Impressionist tours',
      available: true
    },
    {
      id: '2',
      name: 'Pierre Martin',
      avatar: 'assets/images/avatar/james.png',
      languages: ['FR', 'EN'],
      rating: 4,
      reviewCount: 89,
      description: 'Local photographer and Montmartre walking expert',
      verified: true,
      available: true
    },
    {
      id: '3',
      name: 'Antoine Leroy',
      avatar: 'assets/images/avatar/marco.png',
      languages: ['FR', 'EN', 'ES'],
      rating: 0,
      reviewCount: 0,
      description: 'Literary walks through Latin Quarter and Saint-Germain',
      available: false
    },
    {
      id: '4',
      name: 'Camille Rousseau',
      avatar: 'assets/images/avatar/emma.png',
      languages: ['FR', 'EN'],
      rating: 5,
      reviewCount: 203,
      description: 'Seine boat tours and romantic evening walks',
      badge: 'Originals',
      available: true
    }
  ];

  recentlyViewed: ViewedItem[] = [
    {
      title: 'Seine Sunset Cruise',
      price: 45,
      duration: '2h',
      imageUrl: 'assets/images/card_image/seine-sunset.png'
    },
    {
      title: 'Latin Quarter Literary Walk',
      price: 35,
      duration: '2h',
      imageUrl: 'assets/images/card_image/latin-quarter.png'
    },
    {
      title: 'French Pastry Workshop',
      price: 95,
      duration: '3h',
      imageUrl: 'assets/images/card_image/pastry-workshop.png'
    }
  ];

  setActiveTab(tab: 'guides' | 'experiences') {
    this.activeTab = tab;
  }

  toggleMood(mood: string) {
    const index = this.selectedMoods.indexOf(mood);
    if (index > -1) {
      this.selectedMoods.splice(index, 1);
    } else {
      this.selectedMoods.push(mood);
    }
  }

  toggleLanguage(language: string) {
    const index = this.selectedLanguages.indexOf(language);
    if (index > -1) {
      this.selectedLanguages.splice(index, 1);
    } else {
      this.selectedLanguages.push(language);
    }
  }

  isMoodSelected(mood: string): boolean {
    return this.selectedMoods.includes(mood);
  }

  isLanguageSelected(language: string): boolean {
    return this.selectedLanguages.includes(language);
  }

  getRatingStars(rating: number): string[] {
    return Array(5).fill('').map((_, i) => i < rating ? 'full' : 'empty');
  }

  toggleFavorite(id: string, event: Event) {
    event.stopPropagation();
    // Implement favorite toggle logic
  }

  viewProfile(guide: Guide) {
    // Navigate to guide profile
  }

  contactGuide(guide: Guide) {
    // Open contact modal or navigate to messages
  }

  removeFromFavorites(guide: Guide, event: Event) {
    event.stopPropagation();
    // Implement remove from favorites logic
  }

  viewExperience(experience: Experience) {
    // Navigate to experience detail
  }

  contactSupport() {
    // Navigate to support or open chat
  }

  viewFAQs() {
    // Navigate to FAQs page
  }
}
