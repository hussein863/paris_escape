import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MiniCardComponent, TodayExperience } from '../component/mini-card/mini-card.component';

@Component({
  selector: 'app-available-today-in-paris',
  standalone: true,
  imports: [CommonModule, MiniCardComponent],
  templateUrl: './available-today-in-paris.component.html',
  styleUrl: './available-today-in-paris.component.scss'
})
export class AvailableTodayInParisComponent {
  todayExperiences: TodayExperience[] = [
    {
      id: 1,
      title: 'Food Market Tour',
      timeSlot: '2:00 PM - 4:00 PM',
      image: '/assets/images/card_image/food-market.png',
      isToday: true
    },
    {
      id: 2,
      title: 'Latin Quarter Walk',
      timeSlot: '5:00 PM - 7:00 PM',
      image: '/assets/images/card_image/latin-quarter.png',
      isToday: true
    },
    {
      id: 3,
      title: 'Wine Tasting',
      timeSlot: '7:30 PM - 9:30 PM',
      image: '/assets/images/card_image/wine-tasting.png',
      isToday: true
    },
    {
      id: 4,
      title: 'Photo Walk',
      timeSlot: '6:00 PM - 8:00 PM',
      image: '/assets/images/card_image/photo-walk.png',
      isToday: true
    }
  ];

  onSeeAllForToday(): void {
    console.log('See all for today clicked');
  }
}
