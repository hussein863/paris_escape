import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExperienceWizardService } from '../../../../core/services/experience-wizard.service';

@Component({
  selector: 'app-step-basics',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './step-basics.component.html',
  styleUrl: './step-basics.component.scss',
})
export class StepBasicsComponent {
  @Output() dataChange = new EventEmitter<any>();

  constructor(private wizardService: ExperienceWizardService) {}

  saveToApi(): Promise<void> {
    return new Promise((resolve, reject) => {
      const payload = {
        title: this.formData.title,
        short_description: this.formData.shortDescription,
        long_description: this.formData.longDescription,
        highlights: this.formData.highlights
          ? this.formData.highlights.split('\n').filter((h: string) => h.trim())
          : [],
        category: this.formData.category,
        subcategory: this.formData.subcategory,
        tags: this.formData.tags
          ? this.formData.tags.split(',').map((t: string) => t.trim()).filter((t: string) => t)
          : [],
        ...(this.formData.difficulty ? { difficulty: this.formData.difficulty } : {}),
        duration_value: this.formData.durationValue,
        duration_unit: this.formData.durationUnit,
        languages: this.formData.languages,
        group_size_min: this.formData.groupSizeMin,
        group_size_max: this.formData.groupSizeMax,
        max_people: this.formData.groupSizeMax,
        stroller_friendly: this.formData.strollerFriendly,
        wheelchair_accessible: this.formData.wheelchairAccessible,
        has_min_age: this.formData.hasMinAge,
        min_age: this.formData.hasMinAge ? this.formData.minAge : null,
      };

      const id = this.wizardService.experienceId;
      const obs = id
        ? this.wizardService.update(id, payload as any)
        : this.wizardService.create(payload as any);

      obs.subscribe({ next: () => resolve(), error: (e) => reject(e) });
    });
  }

  formData = {
    title: '',
    shortDescription: '',
    longDescription: '',
    highlights: '',
    whoThisIsFor: '',
    category: '',
    subcategory: '',
    tags: '',
    difficulty: 'Easy',
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
