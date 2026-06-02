import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Original {
  id: number;
  title: string;
  description: string;
  image: string;
}

@Component({
  selector: 'app-paris-escape-originals',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './paris-escape-originals.component.html',
  styleUrl: './paris-escape-originals.component.scss'
})
export class ParisEscapeOriginalsComponent {
  originals: Original[] = [
    {
      id: 1,
      title: 'Secret Underground Paris',
      description: 'Explore hidden tunnels and forgotten history',
      image: 'assets/images/card_image/underground-paris.png'
    },
    {
      id: 2,
      title: "Chef's Home Kitchen",
      description: 'Cook with a Michelin-starred chef at home',
      image: 'assets/images/card_image/home-kitchen.png'
    },
    {
      id: 3,
      title: 'Rooftop Paris',
      description: 'Access to exclusive rooftops and terraces',
      image: 'assets/images/card_image/rooftop-paris.png'
    }
  ];
}
