import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Guide {
  name: string;
  avatar: string;
  rating: number;
  reviewsCount: number;
  languages: string[];
  bio: string;
}

@Component({
  selector: 'app-guide-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './guide-profile.component.html',
  styleUrl: './guide-profile.component.scss'
})
export class GuideProfileComponent {
  @Input() guide: Guide = {
    name: '',
    avatar: '',
    rating: 0,
    reviewsCount: 0,
    languages: [],
    bio: ''
  };
}
