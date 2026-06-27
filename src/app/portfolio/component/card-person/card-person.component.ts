import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

export interface Guide {
  id: number;
  encryptedId: string;
  name: string;
  specialty: string;
  rating: number;
  reviewCount: number;
  photo: string;
  languages: string[];
}

@Component({
  selector: 'app-card-person',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './card-person.component.html',
  styleUrl: './card-person.component.scss'
})
export class CardPersonComponent {
  @Input() guide!: Guide;
}
