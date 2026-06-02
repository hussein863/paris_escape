import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Experience {
  id: number;
  title: string;
  category: string;
  image: string;
  videoUrl?: string;
}

@Component({
  selector: 'app-experience-paris',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './experience-paris.component.html',
  styleUrl: './experience-paris.component.scss'
})
export class ExperienceParisComponent {
  experiences: Experience[] = [
    {
      id: 1,
      title: 'Café Culture',
      category: 'Café Culture',
      image: 'assets/images/card_image/cafe-culture.png'
    },
    {
      id: 2,
      title: 'Fashion District',
      category: 'Fashion District',
      image: 'assets/images/card_image/fashion-district.png'
    },
    {
      id: 3,
      title: 'Nightlife',
      category: 'Nightlife',
      image: 'assets/images/card_image/night-life.png'
    }
  ];
}
