import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IdEncryptService } from '../../../core/services/id-encrypt.service';

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

  constructor(private idEncrypt: IdEncryptService) {}

  getExperienceLink(): (string | number)[] {
    return ['/landing/experience', this.idEncrypt.encryptId(this.experience.id)];
  }

  toggleFavorite(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.experience.isFavorite = !this.experience.isFavorite;
  }
}
