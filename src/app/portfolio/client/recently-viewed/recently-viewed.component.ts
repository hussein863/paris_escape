import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ExperienceService } from '../../../core/services/experience.service';

interface RecentItem {
  id: number;
  title: string;
  price: number;
  duration: string;
  image: string;
}

const STORAGE_KEY = 'pe_recently_viewed';
const MAX_ITEMS = 4;

@Component({
  selector: 'app-recently-viewed',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './recently-viewed.component.html',
  styleUrl: './recently-viewed.component.scss'
})
export class RecentlyViewedComponent implements OnInit {
  recentItems: RecentItem[] = [];

  constructor(private experienceService: ExperienceService) {}

  ngOnInit(): void {
    const ids: number[] = this.getStoredIds();
    if (!ids.length) return;

    ids.forEach(id => {
      this.experienceService.get(id).subscribe({
        next: (exp) => {
          if (!this.recentItems.find(r => r.id === exp.id)) {
            this.recentItems.push({
              id: exp.id,
              title: exp.title,
              price: Number(exp.base_price),
              duration: `${exp.duration_value} ${exp.duration_unit}`,
              image: (exp as any).image_url ?? (exp as any).image ?? 'assets/images/card_image/louvre.png',
            });
          }
        }
      });
    });
  }

  static track(experienceId: number): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      let ids: number[] = stored ? JSON.parse(stored) : [];
      ids = [experienceId, ...ids.filter(id => id !== experienceId)].slice(0, MAX_ITEMS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    } catch { /* localStorage unavailable */ }
  }

  private getStoredIds(): number[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch { return []; }
  }

  get hasItems(): boolean { return this.recentItems.length > 0; }
}
