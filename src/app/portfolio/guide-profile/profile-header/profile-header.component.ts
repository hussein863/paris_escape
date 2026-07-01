import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Guide } from '../guide-profile.component';

@Component({
  selector: 'app-profile-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile-header.component.html',
  styleUrl: './profile-header.component.scss'
})
export class ProfileHeaderComponent {
  @Input() guide!: Guide;

  getInitials(name: string): string {
    const parts = (name ?? '').trim().split(/\s+/);
    return ((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')).toUpperCase();
  }
}
