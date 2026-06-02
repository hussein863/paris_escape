import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface TodayExperience {
  id: number;
  title: string;
  timeSlot: string;
  image: string;
  isToday: boolean;
}

@Component({
  selector: 'app-mini-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mini-card.component.html',
  styleUrl: './mini-card.component.scss'
})
export class MiniCardComponent {
  @Input() experience!: TodayExperience;
}
