import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IdEncryptService } from '../../../core/services/id-encrypt.service';

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
  imports: [CommonModule, RouterModule],
  templateUrl: './mini-card.component.html',
  styleUrl: './mini-card.component.scss'
})
export class MiniCardComponent {
  @Input() experience!: TodayExperience;

  constructor(private idEncrypt: IdEncryptService) {}

  getExperienceLink(): (string | number)[] {
    return ['/landing/experience', this.idEncrypt.encryptId(this.experience.id)];
  }
}
