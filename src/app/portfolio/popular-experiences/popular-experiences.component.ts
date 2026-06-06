import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CardComponent, ExperienceCard } from '../component/card/card.component';
import { ExperienceService } from '../../core/services/experience.service';

@Component({
  selector: 'app-popular-experiences',
  standalone: true,
  imports: [CommonModule, CardComponent],
  templateUrl: './popular-experiences.component.html',
  styleUrl: './popular-experiences.component.scss'
})
export class PopularExperiencesComponent implements OnInit {
  experiences: ExperienceCard[] = [];
  loading = true;

  constructor(private experienceService: ExperienceService, private router: Router) {}

  ngOnInit(): void {
    this.experienceService.list({ ordering: '-rating', page: 1 }).subscribe({
      next: (res) => {
        this.experiences = res.results.slice(0, 6).map(e => ({
          id: e.id,
          title: e.title,
          description: e.short_description ?? '',
          image: (e as any).image_url ?? (e as any).image ?? 'assets/images/card_image/louvre.png',
          rating: parseFloat(String(e.rating ?? 0)),
          isFavorite: false,
        }));
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  onViewAll(): void {
    this.router.navigate(['/landing/experience']);
  }
}
