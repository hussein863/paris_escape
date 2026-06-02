import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent, ExperienceCard } from '../component/card/card.component';

@Component({
  selector: 'app-popular-experiences',
  standalone: true,
  imports: [CommonModule, CardComponent],
  templateUrl: './popular-experiences.component.html',
  styleUrl: './popular-experiences.component.scss'
})
export class PopularExperiencesComponent {
  experiences: ExperienceCard[] = [
    {
      id: 1,
      title: 'Private Louvre Tour',
      description: 'Skip the lines with expert guide',
      image: '/assets/images/card_image/louvre.png',
      rating: 4.9,
      isFavorite: false
    },
    {
      id: 2,
      title: 'Montmartre Walking Tour',
      description: 'Artistic neighborhood exploration',
      image: '/assets/images/card_image/montmartre.png',
      rating: 4.8,
      isFavorite: false
    },
    {
      id: 3,
      title: 'Seine Evening Cruise',
      description: 'Romantic river experience',
      image: '/assets/images/card_image/seine.png',
      rating: 4.7,
      isFavorite: false
    }
  ];

  onViewAll(): void {
    console.log('View all experiences clicked');
  }
}
