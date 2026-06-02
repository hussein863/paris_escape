import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-experience-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './experience-header.component.html',
  styleUrl: './experience-header.component.scss'
})
export class ExperienceHeaderComponent {
  @Input() title: string = '';
  @Input() category: string = '';
  @Input() location: string = '';
  @Input() rating: number = 0;
  @Input() reviewsCount: number = 0;
  @Input() badges: string[] = [];

  isFavorite = false;

  toggleFavorite(): void {
    this.isFavorite = !this.isFavorite;
  }

  share(): void {
    if (navigator.share) {
      navigator.share({
        title: this.title,
        url: window.location.href
      });
    }
  }

  getBadgeClass(badge: string): string {
    if (badge === 'Originals') return 'badge-originals';
    if (badge.includes('Instant')) return 'badge-instant';
    if (badge.includes('Free')) return 'badge-free';
    return '';
  }

  getBadgeIcon(badge: string): string {
    if (badge.includes('Instant')) return 'fas fa-check';
    if (badge.includes('Free')) return 'fas fa-undo';
    return '';
  }
}
