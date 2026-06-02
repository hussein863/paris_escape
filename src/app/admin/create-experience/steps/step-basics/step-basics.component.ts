import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-step-basics',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './step-basics.component.html',
  styleUrl: './step-basics.component.scss',
})
export class StepBasicsComponent {
  @Output() dataChange = new EventEmitter<any>();

  formData = {
    title: '',
    shortDescription: '',
    longDescription: '',
    highlights: '',
    whoThisIsFor: '',
    category: '',
    subcategory: '',
    tags: '',
    difficulty: '',
    durationValue: 2,
    durationUnit: 'hours',
    languages: [] as string[],
    groupSizeMin: 1,
    groupSizeMax: 8,
    strollerFriendly: false,
    wheelchairAccessible: false,
    hasMinAge: false,
    minAge: 18,
    meetingPoint: ''
  };

  availableLanguages = ['French', 'English', 'Spanish', 'Arabic'];

  get shortDescriptionLength(): number {
    return this.formData.shortDescription.length;
  }

  get isFormValid(): boolean {
    return this.formData.title.trim() !== '' &&
           this.formData.shortDescription.trim() !== '' &&
           this.formData.category !== '' &&
           this.formData.difficulty !== '';
  }

  toggleLanguage(language: string): void {
    const index = this.formData.languages.indexOf(language);
    if (index > -1) {
      this.formData.languages.splice(index, 1);
    } else {
      this.formData.languages.push(language);
    }
    this.emitData();
  }

  isLanguageSelected(language: string): boolean {
    return this.formData.languages.includes(language);
  }

  onDataChange(): void {
    this.emitData();
  }

  emitData(): void {
    this.dataChange.emit(this.formData);
  }
}
