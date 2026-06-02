import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Guide {
  id: number;
  name: string;
  specialty: string;
  rating: number;
  photo: string;
  languages: string[];
}

@Component({
  selector: 'app-card-person',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-person.component.html',
  styleUrl: './card-person.component.scss'
})
export class CardPersonComponent {
  @Input() guide!: Guide;
}
