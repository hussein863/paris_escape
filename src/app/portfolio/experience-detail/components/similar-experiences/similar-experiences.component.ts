import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Experience {
  id: string;
  title: string;
  image: string;
  duration: string;
  category: string;
  price: number;
  currency: string;
  rating: number;
}

@Component({
  selector: 'app-similar-experiences',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './similar-experiences.component.html',
  styleUrl: './similar-experiences.component.scss'
})
export class SimilarExperiencesComponent {
  @Input() experiences: Experience[] = [];
}
