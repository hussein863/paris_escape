import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Language {
  name: string;
  level: string;
}

interface Specialty {
  name: string;
}

@Component({
  selector: 'app-basic-info',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './basic-info.component.html',
  styleUrl: './basic-info.component.scss',
})
export class BasicInfoComponent {
  firstName = '';
  lastName = '';
  pronouns = '';
  yearsOfExperience = 0;
  bio = '';
  bioMaxLength = 1000;

  languages: Language[] = [
    { name: '', level: 'Native' }
  ];

  specialties: Specialty[] = [
    { name: 'Art & Culture' },
    { name: 'Photography' },
    { name: 'History' },
    { name: 'Food & Wine' }
  ];

  languageLevels = ['Native', 'Fluent', 'Conversational', 'Basic'];

  addLanguage() {
    this.languages.push({ name: '', level: 'Basic' });
  }

  removeLanguage(index: number) {
    this.languages.splice(index, 1);
  }

  addSpecialty() {
    // In a real app, this would open a modal or dropdown
    const specialty = prompt('Enter specialty name:');
    if (specialty) {
      this.specialties.push({ name: specialty });
    }
  }

  removeSpecialty(index: number) {
    this.specialties.splice(index, 1);
  }

  get bioCharacterCount(): number {
    return this.bio.length;
  }
}
