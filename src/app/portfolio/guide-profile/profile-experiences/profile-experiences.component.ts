import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IdEncryptService } from '../../../core/services/id-encrypt.service';
import { Experience } from '../guide-profile.component';

@Component({
  selector: 'app-profile-experiences',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './profile-experiences.component.html',
  styleUrl: './profile-experiences.component.scss'
})
export class ProfileExperiencesComponent {
  @Input() experiences: Experience[] = [];
  @Input() guideName: string = '';

  constructor(private idEncrypt: IdEncryptService) {}

  getExperienceLink(id: number): (string | number)[] {
    return ['/landing/experience', this.idEncrypt.encryptId(id)];
  }

  toggleFavorite(experience: Experience): void {
    experience.isFavorite = !experience.isFavorite;
  }
}
