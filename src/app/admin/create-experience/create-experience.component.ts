import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { StepBasicsComponent } from './steps/step-basics/step-basics.component';
import { StepMediaComponent } from './steps/step-media/step-media.component';
import { StepPricingComponent } from './steps/step-pricing/step-pricing.component';
import { StepOptionsComponent } from './steps/step-options/step-options.component';
import { StepAvailabilityComponent } from './steps/step-availability/step-availability.component';
import { StepInclusionsComponent } from './steps/step-inclusions/step-inclusions.component';
import { StepPoliciesComponent } from './steps/step-policies/step-policies.component';
import { StepPreviewComponent } from './steps/step-preview/step-preview.component';

interface Step {
  number: number;
  title: string;
  subtitle: string;
  description: string;
  completed: boolean;
}

@Component({
  selector: 'app-create-experience',
  standalone: true,
  imports: [CommonModule, SidebarComponent, StepBasicsComponent, StepMediaComponent, StepPricingComponent, StepOptionsComponent, StepAvailabilityComponent, StepInclusionsComponent, StepPoliciesComponent, StepPreviewComponent],
  templateUrl: './create-experience.component.html',
  styleUrl: './create-experience.component.scss',
})
export class CreateExperienceComponent {
  isSidebarOpen = false;
  currentStep = 1;
  totalSteps = 8;

  steps: Step[] = [
    { number: 1, title: 'Create a new experience', subtitle: 'Basics', description: 'Basics', completed: false },
    { number: 2, title: 'Media', subtitle: 'Media', description: 'Upload photos and videos', completed: false },
    { number: 3, title: 'Pricing', subtitle: 'Pricing', description: 'Set your pricing model and rates', completed: false },
    { number: 4, title: 'Options and Add-ons', subtitle: 'Options and Add-ons', description: 'Add optional extras to enhance your experience', completed: false },
    { number: 5, title: 'Availability', subtitle: 'Availability', description: 'Set when your experience is available', completed: false },
    { number: 6, title: 'Inclusions', subtitle: 'Inclusions', description: 'Specify what\'s included and what travelers should bring', completed: false },
    { number: 7, title: 'Policies', subtitle: 'Policies', description: 'Set cancellation rules and safety guidelines', completed: false },
    { number: 8, title: 'Preview', subtitle: 'Preview', description: 'Review your experience before publishing', completed: false }
  ];

  constructor(private router: Router) {}

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidebar(): void {
    this.isSidebarOpen = false;
  }

  get currentStepData(): Step {
    return this.steps[this.currentStep - 1];
  }

  goToStep(step: number): void {
    if (step >= 1 && step <= this.totalSteps) {
      this.currentStep = step;
    }
  }

  nextStep(): void {
    if (this.currentStep < this.totalSteps) {
      this.steps[this.currentStep - 1].completed = true;
      this.currentStep++;
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.steps[this.currentStep - 1].completed = false;
      this.currentStep--;
    } else {
      // If on first step, go back to experiences list
      this.router.navigate(['/admin/experiences']);
    }
  }

  goBack(): void {
    if (this.currentStep === 1) {
      this.router.navigate(['/admin/experiences']);
    } else {
      this.previousStep();
    }
  }

  saveDraft(): void {
    // TODO: Implement save draft functionality
    console.log('Saving draft...');
  }

  publish(): void {
    // TODO: Implement publish functionality
    console.log('Publishing experience...');
    this.router.navigate(['/admin/experiences']);
  }
}
