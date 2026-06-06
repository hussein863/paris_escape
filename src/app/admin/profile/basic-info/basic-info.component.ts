import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { GuideProfileService } from '../../../core/services/guide-profile.service';
import { AuthService } from '../../../core/services/auth.service';
import { environment } from '../../../../environments/environment';

interface LanguageRow {
  id: number | null;
  name: string;
  level: string;
}

interface SpecialtyRow {
  id: number | null;
  name: string;
}

@Component({
  selector: 'app-basic-info',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './basic-info.component.html',
  styleUrl: './basic-info.component.scss',
})
export class BasicInfoComponent implements OnInit {
  firstName = '';
  lastName = '';
  pronouns = '';
  yearsOfExperience = 0;
  bio = '';
  bioMaxLength = 1000;

  languages: LanguageRow[] = [];
  specialties: SpecialtyRow[] = [];
  newSpecialtyName = '';
  showSpecialtyInput = false;

  languageLevels = ['Native', 'Fluent', 'Conversational', 'Basic'];

  saving = false;
  saveSuccess = false;
  saveError = '';

  constructor(
    private guideService: GuideProfileService,
    private auth: AuthService,
    private http: HttpClient,
  ) {}

  ngOnInit(): void {
    const user = this.auth.user();
    if (user?.name) {
      const parts = user.name.split(' ');
      this.firstName = parts[0] ?? '';
      this.lastName = parts.slice(1).join(' ');
    }

    this.guideService.profile$.subscribe(p => {
      if (!p) return;
      this.pronouns = p.pronouns;
      this.yearsOfExperience = p.years_of_experience;
      this.bio = p.bio;
      this.languages = p.languages.map(l => ({ id: l.id, name: l.name, level: l.level }));
      this.specialties = p.specialties.map(s => ({ id: s.id, name: s.name }));
    });
  }

  get bioCharacterCount(): number {
    return this.bio.length;
  }

  save(): void {
    this.saving = true;
    this.saveSuccess = false;
    this.saveError = '';

    // Save name to user endpoint
    const fullName = [this.firstName, this.lastName].filter(Boolean).join(' ');
    this.http.patch(`${environment.apiUrl}/users/me/`, { name: fullName }).subscribe();

    this.guideService.patch({
      pronouns: this.pronouns,
      bio: this.bio,
      years_of_experience: this.yearsOfExperience,
    }).subscribe({
      next: () => {
        this.saving = false;
        this.saveSuccess = true;
        setTimeout(() => (this.saveSuccess = false), 3000);
      },
      error: (err) => {
        this.saving = false;
        this.saveError = err?.error?.detail ?? 'Save failed.';
      },
    });
  }

  addLanguage(): void {
    this.languages.push({ id: null, name: '', level: 'Basic' });
  }

  saveLanguage(lang: LanguageRow): void {
    if (!lang.name.trim()) return;
    this.guideService.addLanguage(lang.name.trim(), lang.level).subscribe(saved => {
      lang.id = saved.id;
      // Reload profile to sync
      this.guideService.load().subscribe();
    });
  }

  removeLanguage(lang: LanguageRow, index: number): void {
    if (lang.id) {
      this.guideService.removeLanguage(lang.id).subscribe(() => {
        this.languages.splice(index, 1);
        this.guideService.load().subscribe();
      });
    } else {
      this.languages.splice(index, 1);
    }
  }

  showAddSpecialty(): void {
    this.showSpecialtyInput = true;
    this.newSpecialtyName = '';
  }

  confirmAddSpecialty(): void {
    const name = this.newSpecialtyName.trim();
    if (!name) {
      this.showSpecialtyInput = false;
      return;
    }
    this.guideService.addSpecialty(name).subscribe(saved => {
      this.specialties.push({ id: saved.id, name: saved.name });
      this.showSpecialtyInput = false;
      this.newSpecialtyName = '';
      this.guideService.load().subscribe();
    });
  }

  removeSpecialty(spec: SpecialtyRow, index: number): void {
    if (spec.id) {
      this.guideService.removeSpecialty(spec.id).subscribe(() => {
        this.specialties.splice(index, 1);
        this.guideService.load().subscribe();
      });
    } else {
      this.specialties.splice(index, 1);
    }
  }
}
