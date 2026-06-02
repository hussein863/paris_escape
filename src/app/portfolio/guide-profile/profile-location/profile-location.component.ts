import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Guide } from '../guide-profile.component';

@Component({
  selector: 'app-profile-location',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile-location.component.html',
  styleUrl: './profile-location.component.scss'
})
export class ProfileLocationComponent {
  @Input() guide!: Guide;
}
