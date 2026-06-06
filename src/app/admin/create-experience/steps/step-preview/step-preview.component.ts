import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExperienceWizardService } from '../../../../core/services/experience-wizard.service';

@Component({
  selector: 'app-step-preview',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './step-preview.component.html',
  styleUrl: './step-preview.component.scss',
})
export class StepPreviewComponent implements OnChanges {
  @Input() experienceId: number | null = null;
  @Output() dataChange = new EventEmitter<any>();

  previewDevice: 'desktop' | 'tablet' | 'mobile' = 'desktop';
  experienceFromApi: any = null;
  loading = false;

  constructor(private wizardService: ExperienceWizardService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['experienceId'] && this.experienceId) {
      this.loadFromApi();
    }
  }

  loadFromApi(): void {
    if (!this.experienceId) return;
    this.loading = true;
    this.wizardService.get(this.experienceId).subscribe({
      next: (exp) => {
        this.experienceFromApi = exp;
        // Populate experienceData from real API response
        this.experienceData = {
          title: exp.title,
          location: 'Paris',
          rating: exp.rating || 0,
          reviewCount: 0,
          coverImage: (exp as any).image_url || this.experienceData.coverImage,
          categories: [exp.category, exp.subcategory].filter(Boolean),
          shortDescription: exp.short_description,
          duration: `${exp.duration_value} ${exp.duration_unit}`,
          maxPeople: `Max ${exp.max_people} people`,
          languages: exp.languages?.join(', ') || '',
          difficulty: exp.difficulty,
          price: Number(exp.base_price) || 0,
          included: (exp as any).inclusions?.filter((i: any) => i.type === 'included').map((i: any) => i.text) || [],
          toBring: (exp as any).inclusions?.filter((i: any) => i.type === 'to-bring').map((i: any) => i.text) || [],
        };
        // Update validation summary based on real data
        this.validationSummary = {
          basicInformation: !!exp.title && !!exp.category,
          mediaGallery: !!(exp as any).image || ((exp as any).media?.length > 0),
          pricingOptions: Number(exp.base_price) > 0,
          availability: !!(exp as any).availability,
          inclusions: ((exp as any).inclusions?.length || 0) > 0,
          policies: !!(exp as any).policy,
          readyToPublish: !!exp.title && !!exp.category && Number(exp.base_price) > 0,
        };
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  // Mock experience data (used as fallback before API data loads)
  experienceData = {
    title: 'Secret Paris: Hidden Courtyards and Local Stories',
    location: 'Seine & Marais',
    rating: 4.9,
    reviewCount: 127,
    coverImage: 'assets/images/ed257ac73d6c1689fd1f2f06a778761fbc142da3.png',
    categories: ['Culture', 'Romantic'],
    shortDescription: 'Discover the hidden side of Paris through secret courtyards, local stories, and authentic neighborhoods that most tourists never see. Perfect for culture lovers and photography enthusiasts.',
    duration: '3 hours',
    maxPeople: 'Max 8 people',
    languages: 'French, English',
    difficulty: 'Easy',
    price: 45,
    included: [
      'Expert local guide',
      'Historical stories and anecdotes',
      'Access to private courtyards',
      'Photography tips and spots'
    ],
    toBring: [
      'Comfortable walking shoes',
      'Camera or smartphone',
      'Weather-appropriate clothing'
    ]
  };

  validationSummary = {
    basicInformation: true,
    mediaGallery: true,
    pricingOptions: true,
    availability: true,
    inclusions: true,
    policies: true,
    readyToPublish: true
  };

  seoPreview = {
    url: 'paris-escape.com/tour/secret-paris-hidden-courtyards',
    title: 'Secret Paris: Hidden Courtyards and Local Stories',
    description: 'Discover the hidden side of Paris through secret courtyards, local stories,',
    titleLength: 52,
    descriptionLength: 158,
    urlOptimized: true
  };

  publishingChecklist = [
    {
      completed: true,
      title: 'Experience details complete',
      description: 'Title, description, category, and tags'
    },
    {
      completed: true,
      title: 'High-quality photos added',
      description: 'Minimum 5 photos recommended'
    },
    {
      completed: true,
      title: 'Pricing configured',
      description: 'Base price and options set'
    },
    {
      completed: false,
      title: 'KYC verification pending',
      description: 'Required for paid experiences',
      warning: true
    }
  ];

  get allValidationsPassed(): boolean {
    return Object.values(this.validationSummary).every(v => v === true);
  }

  selectDevice(device: 'desktop' | 'tablet' | 'mobile'): void {
    this.previewDevice = device;
  }

  completeVerification(): void {
    /* not implemented */
  }

  contactGuide(): void {
    /* not implemented */
  }

  publishExperience(): void {
    if (this.allValidationsPassed) {
      /* not implemented */
      this.emitData();
    }
  }

  saveDraft(): void {
    /* not implemented */
    this.emitData();
  }

  emitData(): void {
    this.dataChange.emit({
      action: 'publish',
      experienceData: this.experienceData
    });
  }
}

