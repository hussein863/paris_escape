import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface Mood {
  label: string;
  active: boolean;
}

@Component({
  selector: 'app-explore-by-mood',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './explore-by-mood.component.html',
  styleUrl: './explore-by-mood.component.scss'
})
export class ExploreByMoodComponent {
  moods: Mood[] = [
    { label: 'Romantic', active: false },
    { label: 'Unusual', active: true },
    { label: 'Photo', active: false },
    { label: 'Family', active: false },
    { label: 'Food', active: false },
    { label: 'Culture', active: false }
  ];

  constructor(private router: Router) {}

  selectMood(selected: Mood): void {
    this.moods.forEach(m => m.active = false);
    selected.active = true;
    this.router.navigate(['/landing/experience'], { queryParams: { search: selected.label } });
  }
}
