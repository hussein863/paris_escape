import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-step-preview',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './step-preview.component.html',
  styleUrl: './step-preview.component.scss',
})
export class StepPreviewComponent {
  @Output() dataChange = new EventEmitter<any>();

  previewDevice: 'desktop' | 'tablet' | 'mobile' = 'desktop';

  // Mock experience data
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
    console.log('Complete KYC verification');
    // Placeholder for verification flow
  }

  contactGuide(): void {
    console.log('Contact guide');
    // Placeholder for contact functionality
  }

  publishExperience(): void {
    if (this.allValidationsPassed) {
      console.log('Publishing experience');
      // Placeholder for publish functionality
      this.emitData();
    }
  }

  saveDraft(): void {
    console.log('Saving draft');
    // Placeholder for save draft functionality
    this.emitData();
  }

  emitData(): void {
    this.dataChange.emit({
      action: 'publish',
      experienceData: this.experienceData
    });
  }
}
