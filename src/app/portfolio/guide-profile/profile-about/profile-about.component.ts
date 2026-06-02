import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Guide } from '../guide-profile.component';

@Component({
  selector: 'app-profile-about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile-about.component.html',
  styleUrl: './profile-about.component.scss'
})
export class ProfileAboutComponent {
  @Input() guide!: Guide;
  isExpanded = true;

  toggleReadMore(): void {
    this.isExpanded = !this.isExpanded;
  }
}
