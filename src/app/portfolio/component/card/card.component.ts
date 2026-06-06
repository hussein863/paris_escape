import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

export interface ExperienceCard {
  id: number;
  title: string;
  description: string;
  image: string;
  rating: number;
  isFavorite?: boolean;
}

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent {
  @Input() experience!: ExperienceCard;
  
  toggleFavorite(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.experience.isFavorite = !this.experience.isFavorite;
  }
}
