import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Experience } from '../guide-profile.component';

@Component({
  selector: 'app-profile-experiences',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './profile-experiences.component.html',
  styleUrl: './profile-experiences.component.scss'
})
export class ProfileExperiencesComponent {
  @Input() experiences: Experience[] = [];
  @Input() guideName: string = '';

  toggleFavorite(experience: Experience): void {
    experience.isFavorite = !experience.isFavorite;
  }
}
