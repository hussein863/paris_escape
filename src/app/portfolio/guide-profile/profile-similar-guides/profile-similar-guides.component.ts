import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SimilarGuide } from '../guide-profile.component';

@Component({
  selector: 'app-profile-similar-guides',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './profile-similar-guides.component.html',
  styleUrl: './profile-similar-guides.component.scss'
})
export class ProfileSimilarGuidesComponent {
  @Input() guides: SimilarGuide[] = [];

  getInitials(name: string): string {
    const parts = name.trim().split(' ');
    return (parts[0][0] + (parts[1]?.[0] ?? '')).toUpperCase();
  }
}
