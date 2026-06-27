import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ExperienceService } from '../../core/services/experience.service';

interface Original {
  id: number;
  title: string;
  description: string;
  image: string;
}

@Component({
  selector: 'app-paris-escape-originals',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './paris-escape-originals.component.html',
  styleUrl: './paris-escape-originals.component.scss'
})
export class ParisEscapeOriginalsComponent implements OnInit {
  originals: Original[] = [];
  loading = true;

  constructor(private experienceService: ExperienceService) {}

  ngOnInit(): void {
    // Load top 3 active experiences as "originals"
    this.experienceService.list({ ordering: '-rating,-created_date', page: 1 }).subscribe({
      next: (res) => {
        this.originals = res.results.slice(0, 3).map(e => ({
          id: e.id,
          title: e.title,
          description: e.short_description ?? '',
          image: (e as any).image_url ?? (e as any).image ?? 'assets/images/card_image/montmartre.png',
        }));
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }
}
