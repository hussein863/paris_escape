import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ExperienceWizardService } from '../../../../core/services/experience-wizard.service';
import { GuideProfileService } from '../../../../core/services/guide-profile.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-step-basics',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './step-basics.component.html',
  styleUrl: './step-basics.component.scss',
})
export class StepBasicsComponent implements OnInit {
  @Output() dataChange = new EventEmitter<any>();

  fieldErrors: Record<string, string> = {};
  submitted = false;
  categories: { id: number; name: string; slug: string; subcategories: { id: number; name: string; slug: string }[] }[] = [];
  subcategories: { id: number; name: string; slug: string }[] = [];

  meetingPoints: { id: number; name: string; address: string; is_default: boolean }[] = [];
  showAddMeetingPoint = false;
  newMeetingPoint = { name: '', address: '' };
  savingMeetingPoint = false;
  meetingPointError = '';

  constructor(
    private wizardService: ExperienceWizardService,
    private http: HttpClient,
    private guideProfileService: GuideProfileService,
  ) {}

  ngOnInit(): void {
    const saved = this.wizardService.getStepState('basics');
    if (saved) Object.assign(this.formData, saved);

    this.http.get<any>(`${environment.apiUrl}/experiences/categories/`).subscribe({
      next: (res) => {
        this.categories = res.results ?? res;
        if (this.formData.category) this.prefillSubcategories(this.formData.category);
      },
      error: () => {}
    });
    this.loadMeetingPoints();
  }

  loadMeetingPoints(): void {
    this.guideProfileService.load().subscribe({
      next: (profile) => {
        this.meetingPoints = profile.meeting_points ?? [];
        // Auto-select default if nothing selected yet
        if (!this.formData.meetingPointId) {
          const def = this.meetingPoints.find(mp => mp.is_default);
          if (def) this.formData.meetingPointId = def.id;
        }
      },
      error: () => {}
    });
  }

  openAddMeetingPoint(): void {
    this.showAddMeetingPoint = true;
    this.newMeetingPoint = { name: '', address: '' };
    this.meetingPointError = '';
  }

  cancelAddMeetingPoint(): void {
    this.showAddMeetingPoint = false;
  }

  saveMeetingPoint(): void {
    if (!this.newMeetingPoint.name.trim()) {
      this.meetingPointError = 'Name is required.';
      return;
    }
    this.savingMeetingPoint = true;
    this.meetingPointError = '';
    this.guideProfileService.addMeetingPoint({
      name: this.newMeetingPoint.name.trim(),
      address: this.newMeetingPoint.address.trim(),
      is_default: this.meetingPoints.length === 0,
    }).subscribe({
      next: (mp: any) => {
        this.meetingPoints = [...this.meetingPoints, mp];
        this.formData.meetingPointId = mp.id;
        this.savingMeetingPoint = false;
        this.showAddMeetingPoint = false;
        this.emitData();
      },
      error: () => {
        this.meetingPointError = 'Failed to save. Please try again.';
        this.savingMeetingPoint = false;
      }
    });
  }

  onCategoryChange(): void {
    const cat = this.categories.find(c => c.slug === this.formData.category);
    this.subcategories = cat ? cat.subcategories : [];
    this.formData.subcategory = '';
    this.onDataChange('category');
  }

  prefillSubcategories(categorySlug: string): void {
    const cat = this.categories.find(c => c.slug === categorySlug);
    this.subcategories = cat ? cat.subcategories : [];
  }

  private validate(): boolean {
    this.fieldErrors = {};
    if (!this.formData.title.trim()) this.fieldErrors['title'] = 'Title is required.';
    if (!this.formData.category) this.fieldErrors['category'] = 'Please select a category.';
    if (!this.formData.difficulty) this.fieldErrors['difficulty'] = 'Please select a difficulty level.';
    return Object.keys(this.fieldErrors).length === 0;
  }

  saveToApi(): Promise<void> {
    this.submitted = true;
    if (!this.validate()) return Promise.reject(new Error('Please fix the errors above.'));

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
        tags: this.formData.tags,
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

      obs.subscribe({
        next: () => resolve(),
        error: (e) => {
          if (e?.error && typeof e.error === 'object') {
            Object.entries(e.error).forEach(([key, val]) => {
              const fieldMap: Record<string, string> = {
                title: 'title', short_description: 'shortDescription',
                category: 'category', difficulty: 'difficulty',
              };
              const mapped = fieldMap[key] || key;
              this.fieldErrors[mapped] = Array.isArray(val) ? val[0] : String(val);
            });
          }
          reject(e);
        }
      });
    });
  }

  tagInput = '';

  formData = {
    title: '',
    shortDescription: '',
    longDescription: '',
    highlights: '',
    whoThisIsFor: '',
    category: '',
    subcategory: '',
    tags: [] as string[],
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
    meetingPointId: null as number | null,
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

  addTag(event: KeyboardEvent): void {
    if (event.key !== 'Enter') return;
    event.preventDefault();
    const value = this.tagInput.trim();
    if (value && !this.formData.tags.includes(value)) {
      this.formData.tags = [...this.formData.tags, value];
      this.emitData();
    }
    this.tagInput = '';
  }

  removeTag(tag: string): void {
    this.formData.tags = this.formData.tags.filter(t => t !== tag);
    this.emitData();
  }

  onDataChange(field?: string): void {
    if (field && this.fieldErrors[field]) delete this.fieldErrors[field];
    this.wizardService.saveStepState('basics', this.formData);
    this.emitData();
  }

  emitData(): void {
    this.wizardService.saveStepState('basics', this.formData);
    this.dataChange.emit(this.formData);
  }
}
