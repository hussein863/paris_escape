import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface RecentItem {
  id: number;
  title: string;
  price: number;
  duration: string;
  image: string;
}

@Component({
  selector: 'app-recently-viewed',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recently-viewed.component.html',
  styleUrl: './recently-viewed.component.scss'
})
export class RecentlyViewedComponent {
  recentItems: RecentItem[] = [
    {
      id: 1,
      title: 'Seine Sunset Cruise',
      price: 45,
      duration: '2h',
      image: 'assets/images/card_image/seine-sunset.png'
    },
    {
      id: 2,
      title: 'Latin Quarter Literary Walk',
      price: 35,
      duration: '2h',
      image: 'assets/images/card_image/latin-quarter.png'
    },
    {
      id: 3,
      title: 'French Pastry Workshop',
      price: 95,
      duration: '3h',
      image: 'assets/images/card_image/pastry-workshop.png'
    }
  ];
}
