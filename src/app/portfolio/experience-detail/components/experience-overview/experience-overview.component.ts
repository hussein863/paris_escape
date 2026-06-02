import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Highlight {
  text: string;
}

interface AudienceTag {
  label: string;
}

interface ItineraryStep {
  order: number;
  title: string;
  duration: string;
  description: string;
}

interface IncludedItem {
  text: string;
  included: boolean;
}

interface WhatToBring {
  text: string;
  type: 'recommended' | 'required';
}

@Component({
  selector: 'app-experience-overview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './experience-overview.component.html',
  styleUrl: './experience-overview.component.scss'
})
export class ExperienceOverviewComponent {
  @Input() description: string = '';
  @Input() highlights: Highlight[] = [];
  @Input() whatYouWillDo: string = '';
  @Input() audienceTags: AudienceTag[] = [];
  @Input() itinerary: ItineraryStep[] = [];
  @Input() includedItems: IncludedItem[] = [];
  @Input() whatToBring: WhatToBring[] = [];

  getIncludedItems(included: boolean): IncludedItem[] {
    return this.includedItems.filter(item => item.included === included);
  }
}
