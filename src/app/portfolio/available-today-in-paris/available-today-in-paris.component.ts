import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MiniCardComponent, TodayExperience } from '../component/mini-card/mini-card.component';
import { ExperienceService } from '../../core/services/experience.service';

@Component({
  selector: 'app-available-today-in-paris',
  standalone: true,
  imports: [CommonModule, MiniCardComponent],
  templateUrl: './available-today-in-paris.component.html',
  styleUrl: './available-today-in-paris.component.scss'
})
export class AvailableTodayInParisComponent implements OnInit {
  todayExperiences: TodayExperience[] = [];
  loading = true;

  constructor(private experienceService: ExperienceService, private router: Router) {}

  ngOnInit(): void {
    this.experienceService.list({ ordering: '-views', page: 1 }).subscribe({
      next: (res) => {
        this.todayExperiences = res.results.slice(0, 4).map(e => ({
          id: e.id,
          title: e.title,
          timeSlot: (e as any).availability?.time_slots?.[0]?.time
            ? `From ${(e as any).availability.time_slots[0].time}`
            : 'Various times',
          image: (e as any).image_url ?? (e as any).image ?? 'assets/images/card_image/louvre.png',
          isToday: true,
        }));
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  onSeeAllForToday(): void {
    this.router.navigate(['/landing/experience']);
  }
}
