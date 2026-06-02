import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface Experience {
  id: number;
  title: string;
  duration: string;
  category: string;
  location: string;
  rating: number;
  reviewCount: number;
  price: number;
  image: string;
  isFavorite: boolean;
  badge?: string;
}

@Component({
  selector: 'app-experiences-grid',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './experiences-grid.component.html',
  styleUrl: './experiences-grid.component.scss'
})
export class ExperiencesGridComponent {
  viewMode: 'grid' | 'circle' | 'list' = 'circle';
  selectedSort = 'relevance';
  currentPage = 1;
  itemsPerPage = 9;

  constructor(private router: Router) {}

  allExperiences: Experience[] = [
    {
      id: 1,
      title: 'Private Louvre Tour',
      duration: '3 hours',
      category: 'Museums & Art',
      location: '1st Arr.',
      rating: 4.9,
      reviewCount: 234,
      price: 85,
      image: 'assets/images/card_image/louvre.png',
      isFavorite: false
    },
    {
      id: 2,
      title: 'Montmartre Walking Tour',
      duration: '2.5 hours',
      category: 'Walking Tours',
      location: '18th Arr.',
      rating: 4.8,
      reviewCount: 180,
      price: 65,
      image: 'assets/images/card_image/montmartre.png',
      isFavorite: true
    },
    {
      id: 3,
      title: 'Food Market Tour',
      duration: '2 hours',
      category: 'Food & Wine',
      location: 'Marais',
      rating: 4.9,
      reviewCount: 312,
      price: 95,
      image: 'assets/images/card_image/food-market.png',
      isFavorite: false
    },
    {
      id: 4,
      title: 'Secret Underground Paris',
      duration: '4 hours',
      category: 'Unusual',
      location: 'Various',
      rating: 5.0,
      reviewCount: 156,
      price: 120,
      image: 'assets/images/card_image/underground-paris.png',
      isFavorite: false,
      badge: 'Originals'
    },
    {
      id: 5,
      title: 'Seine Evening Cruise',
      duration: '1.5 hours',
      category: 'Romantic',
      location: 'Seine',
      rating: 4.7,
      reviewCount: 428,
      price: 75,
      image: 'assets/images/card_image/seine.png',
      isFavorite: false,
      badge: 'Today'
    },
    {
      id: 6,
      title: 'Photo Walk',
      duration: '2 hours',
      category: 'Photography',
      location: 'Various',
      rating: 4.9,
      reviewCount: 267,
      price: 70,
      image: 'assets/images/card_image/photo-walk.png',
      isFavorite: false
    },
    {
      id: 7,
      title: 'Latin Quarter Walk',
      duration: '2.5 hours',
      category: 'Culture',
      location: '5th Arr.',
      rating: 4.8,
      reviewCount: 198,
      price: 60,
      image: 'assets/images/card_image/latin-quarter.png',
      isFavorite: false
    },
    {
      id: 8,
      title: 'Wine Tasting Tour',
      duration: '3 hours',
      category: 'Food & Wine',
      location: 'Saint-Germain',
      rating: 4.9,
      reviewCount: 348,
      price: 110,
      image: 'assets/images/card_image/wine-tasting.png',
      isFavorite: false
    },
    {
      id: 9,
      title: 'Family Fun Day',
      duration: '4 hours',
      category: 'Family',
      location: 'Various',
      rating: 5.0,
      reviewCount: 221,
      price: 90,
      image: 'assets/images/porfolio/hero.png',
      isFavorite: false
    },
    {
      id: 10,
      title: 'Versailles Palace Tour',
      duration: '5 hours',
      category: 'History',
      location: 'Versailles',
      rating: 4.9,
      reviewCount: 567,
      price: 145,
      image: 'assets/images/card_image/louvre.png',
      isFavorite: false,
      badge: 'Popular'
    },
    {
      id: 11,
      title: 'Street Art Tour',
      duration: '2.5 hours',
      category: 'Art & Culture',
      location: '13th Arr.',
      rating: 4.7,
      reviewCount: 142,
      price: 55,
      image: 'assets/images/card_image/montmartre.png',
      isFavorite: false
    },
    {
      id: 12,
      title: 'Cheese & Wine Pairing',
      duration: '2 hours',
      category: 'Food & Wine',
      location: 'Le Marais',
      rating: 4.9,
      reviewCount: 289,
      price: 85,
      image: 'assets/images/card_image/wine-tasting.png',
      isFavorite: false
    },
    {
      id: 13,
      title: 'Notre Dame & Ile Tour',
      duration: '3 hours',
      category: 'History',
      location: '4th Arr.',
      rating: 4.8,
      reviewCount: 395,
      price: 70,
      image: 'assets/images/card_image/latin-quarter.png',
      isFavorite: false
    },
    {
      id: 14,
      title: 'Paris by Night',
      duration: '3.5 hours',
      category: 'Romantic',
      location: 'Various',
      rating: 5.0,
      reviewCount: 478,
      price: 95,
      image: 'assets/images/card_image/seine.png',
      isFavorite: true,
      badge: 'Originals'
    },
    {
      id: 15,
      title: 'Pastry Making Class',
      duration: '3 hours',
      category: 'Food & Wine',
      location: 'Saint-Germain',
      rating: 4.9,
      reviewCount: 312,
      price: 125,
      image: 'assets/images/card_image/food-market.png',
      isFavorite: false
    },
    {
      id: 16,
      title: 'Eiffel Tower Insider',
      duration: '2 hours',
      category: 'Landmarks',
      location: '7th Arr.',
      rating: 4.8,
      reviewCount: 623,
      price: 89,
      image: 'assets/images/porfolio/hero.png',
      isFavorite: false
    },
    {
      id: 17,
      title: 'Bike Tour Paris',
      duration: '4 hours',
      category: 'Active',
      location: 'Various',
      rating: 4.7,
      reviewCount: 254,
      price: 75,
      image: 'assets/images/card_image/photo-walk.png',
      isFavorite: false
    },
    {
      id: 18,
      title: 'Hidden Gardens Walk',
      duration: '2.5 hours',
      category: 'Nature',
      location: 'Various',
      rating: 4.8,
      reviewCount: 189,
      price: 65,
      image: 'assets/images/card_image/montmartre.png',
      isFavorite: false
    },
    {
      id: 19,
      title: 'Cooking Class',
      duration: '4 hours',
      category: 'Food & Wine',
      location: 'Montmartre',
      rating: 5.0,
      reviewCount: 445,
      price: 135,
      image: 'assets/images/card_image/food-market.png',
      isFavorite: false,
      badge: 'Originals'
    },
    {
      id: 20,
      title: 'Arc de Triomphe Tour',
      duration: '1.5 hours',
      category: 'Landmarks',
      location: '8th Arr.',
      rating: 4.6,
      reviewCount: 298,
      price: 55,
      image: 'assets/images/card_image/louvre.png',
      isFavorite: false
    },
    {
      id: 21,
      title: 'Seine Kayak Adventure',
      duration: '3 hours',
      category: 'Active',
      location: 'Seine',
      rating: 4.9,
      reviewCount: 167,
      price: 89,
      image: 'assets/images/card_image/seine.png',
      isFavorite: false
    },
    {
      id: 22,
      title: 'Vintage Shopping Tour',
      duration: '2 hours',
      category: 'Shopping',
      location: 'Le Marais',
      rating: 4.7,
      reviewCount: 134,
      price: 50,
      image: 'assets/images/card_image/photo-walk.png',
      isFavorite: false
    },
    {
      id: 23,
      title: 'Opera Garnier Tour',
      duration: '1.5 hours',
      category: 'Art & Culture',
      location: '9th Arr.',
      rating: 4.8,
      reviewCount: 412,
      price: 68,
      image: 'assets/images/card_image/louvre.png',
      isFavorite: false
    },
    {
      id: 24,
      title: 'Market to Table Experience',
      duration: '5 hours',
      category: 'Food & Wine',
      location: 'Various',
      rating: 5.0,
      reviewCount: 356,
      price: 150,
      image: 'assets/images/card_image/food-market.png',
      isFavorite: false,
      badge: 'Today'
    },
    {
      id: 25,
      title: 'Latin Quarter Food Tour',
      duration: '3 hours',
      category: 'Food & Wine',
      location: '5th Arr.',
      rating: 4.9,
      reviewCount: 523,
      price: 98,
      image: 'assets/images/card_image/latin-quarter.png',
      isFavorite: false
    },
    {
      id: 26,
      title: 'Catacombs Private Tour',
      duration: '2 hours',
      category: 'Unusual',
      location: '14th Arr.',
      rating: 4.8,
      reviewCount: 289,
      price: 78,
      image: 'assets/images/card_image/underground-paris.png',
      isFavorite: false
    },
    {
      id: 27,
      title: 'Perfume Workshop',
      duration: '2.5 hours',
      category: 'Experience',
      location: 'Marais',
      rating: 4.9,
      reviewCount: 201,
      price: 115,
      image: 'assets/images/card_image/wine-tasting.png',
      isFavorite: true
    }
  ];

  get experiences(): Experience[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.allExperiences.slice(startIndex, endIndex);
  }

  get totalPages(): number {
    return Math.ceil(this.allExperiences.length / this.itemsPerPage);
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  setViewMode(mode: 'grid' | 'circle' | 'list'): void {
    this.viewMode = mode;
  }

  toggleFavorite(experience: Experience): void {
    experience.isFavorite = !experience.isFavorite;
  }

  goToExperience(id: number): void {
    this.router.navigate(['/landing/experience', id]);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}
