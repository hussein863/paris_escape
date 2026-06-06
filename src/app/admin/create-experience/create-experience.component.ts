import { Component, ViewChild, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { AdminHeaderComponent } from '../header/admin-header.component';
import { StepBasicsComponent } from './steps/step-basics/step-basics.component';
import { StepMediaComponent } from './steps/step-media/step-media.component';
import { StepPricingComponent } from './steps/step-pricing/step-pricing.component';
import { StepOptionsComponent } from './steps/step-options/step-options.component';
import { StepAvailabilityComponent } from './steps/step-availability/step-availability.component';
import { StepInclusionsComponent } from './steps/step-inclusions/step-inclusions.component';
import { StepPoliciesComponent } from './steps/step-policies/step-policies.component';
import { StepPreviewComponent } from './steps/step-preview/step-preview.component';
import { ExperienceWizardService } from '../../core/services/experience-wizard.service';

@Component({
  selector: 'app-create-experience',
  standalone: true,
  imports: [CommonModule, SidebarComponent, AdminHeaderComponent, StepBasicsComponent, StepMediaComponent, StepPricingComponent, StepOptionsComponent, StepAvailabilityComponent, StepInclusionsComponent, StepPoliciesComponent, StepPreviewComponent],
  templateUrl: './create-experience.component.html',
  styleUrl: './create-experience.component.scss',
})
export class CreateExperienceComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(StepBasicsComponent) stepBasics!: StepBasicsComponent;
  @ViewChild(StepMediaComponent) stepMedia!: StepMediaComponent;
  @ViewChild(StepPricingComponent) stepPricing!: StepPricingComponent;
  @ViewChild(StepOptionsComponent) stepOptions!: StepOptionsComponent;
  @ViewChild(StepAvailabilityComponent) stepAvailability!: StepAvailabilityComponent;
  @ViewChild(StepInclusionsComponent) stepInclusions!: StepInclusionsComponent;
  @ViewChild(StepPoliciesComponent) stepPolicies!: StepPoliciesComponent;
  @ViewChild(StepPreviewComponent) stepPreview!: StepPreviewComponent;

  isSidebarOpen = false;
  currentStep = 1;
  totalSteps = 8;
  saving = false;
  saveError = '';
  isEditing = false;
  private pendingPrefill: any = null;

  steps = [
    { number: 1, title: 'Create a new experience', subtitle: 'Basics', description: 'Basics', completed: false },
    { number: 2, title: 'Media', subtitle: 'Media', description: 'Upload photos and videos', completed: false },
    { number: 3, title: 'Pricing', subtitle: 'Pricing', description: 'Set your pricing model and rates', completed: false },
    { number: 4, title: 'Options and Add-ons', subtitle: 'Options and Add-ons', description: 'Add optional extras to enhance your experience', completed: false },
    { number: 5, title: 'Availability', subtitle: 'Availability', description: 'Set when your experience is available', completed: false },
    { number: 6, title: 'Inclusions', subtitle: 'Inclusions', description: 'Specify what\'s included and what travelers should bring', completed: false },
    { number: 7, title: 'Policies', subtitle: 'Policies', description: 'Set cancellation rules and safety guidelines', completed: false },
    { number: 8, title: 'Preview', subtitle: 'Preview', description: 'Review your experience before publishing', completed: false },
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public wizardService: ExperienceWizardService,
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.isEditing = true;
        this.steps[0].title = 'Edit experience';
        this.wizardService.setId(+id);
        this.wizardService.get(+id).subscribe({
          next: (exp) => {
            this.pendingPrefill = exp;
            this.prefillSteps(exp);
          }
        });
      }
    });
  }

  private prefillSteps(exp: any): void {
    // Step 1 — basics
    if (this.stepBasics) {
      this.stepBasics.formData = {
        ...this.stepBasics.formData,
        title: exp.title ?? '',
        shortDescription: exp.short_description ?? '',
        longDescription: exp.long_description ?? '',
        highlights: (exp.highlights ?? []).join('\n'),
        category: exp.category ?? '',
        subcategory: exp.subcategory ?? '',
        tags: (exp.tags ?? []).join(', '),
        difficulty: exp.difficulty ?? 'Easy',
        durationValue: exp.duration_value ?? 2,
        durationUnit: exp.duration_unit ?? 'hours',
        languages: exp.languages ?? [],
        groupSizeMin: exp.group_size_min ?? 1,
        groupSizeMax: exp.group_size_max ?? 8,
        strollerFriendly: exp.stroller_friendly ?? false,
        wheelchairAccessible: exp.wheelchair_accessible ?? false,
        hasMinAge: exp.has_min_age ?? false,
        minAge: exp.min_age ?? 18,
      };
    }
    // Step 3 — pricing
    if (this.stepPricing) {
      this.stepPricing.formData = {
        ...this.stepPricing.formData,
        pricingModel: exp.pricing_model ?? 'per-person',
        currency: exp.currency ?? 'EUR',
        basePrice: Number(exp.base_price ?? 45),
        childPricingEnabled: exp.child_pricing_enabled ?? false,
        childPrice: Number(exp.child_price ?? 0),
        childAgeRange: exp.child_age_range ?? '3-12',
      };
    }
  }

  ngAfterViewInit(): void {
    if (this.pendingPrefill) this.prefillSteps(this.pendingPrefill);
  }

  ngOnDestroy(): void {
    this.wizardService.clearId();
  }

  toggleSidebar(): void { this.isSidebarOpen = !this.isSidebarOpen; }
  closeSidebar(): void { this.isSidebarOpen = false; }

  get currentStepData() { return this.steps[this.currentStep - 1]; }
  get experienceId(): number | null { return this.wizardService.experienceId; }

  goToStep(step: number): void {
    if (step >= 1 && step <= this.totalSteps && (step <= this.currentStep || this.steps[step - 2]?.completed)) {
      this.currentStep = step;
    }
  }

  async nextStep(): Promise<void> {
    this.saveError = '';
    this.saving = true;
    try {
      await this.saveCurrentStep();
      this.steps[this.currentStep - 1].completed = true;
      if (this.currentStep < this.totalSteps) this.currentStep++;
    } catch (err: any) {
      this.saveError = err?.message || 'Save failed. Please try again.';
    } finally {
      this.saving = false;
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    } else {
      this.router.navigate(['/admin/experiences']);
    }
  }

  goBack(): void {
    this.previousStep();
  }

  async saveDraft(): Promise<void> {
    this.saveError = '';
    this.saving = true;
    try {
      await this.saveCurrentStep();
    } catch (err: any) {
      this.saveError = err?.message || 'Save failed.';
    } finally {
      this.saving = false;
    }
  }

  async publish(): Promise<void> {
    const id = this.wizardService.experienceId;
    if (!id) { this.saveError = 'Please complete step 1 first.'; return; }
    this.saving = true;
    this.saveError = '';
    this.wizardService.publish(id).subscribe({
      next: () => {
        this.saving = false;
        this.router.navigate(['/admin/experiences']);
      },
      error: (err) => {
        this.saving = false;
        this.saveError = err?.error?.detail || 'Publish failed.';
      }
    });
  }

  private saveCurrentStep(): Promise<void> {
    switch (this.currentStep) {
      case 1: return this.stepBasics?.saveToApi() || Promise.resolve();
      case 2: return this.stepMedia?.saveToApi() || Promise.resolve();
      case 3: return this.stepPricing?.saveToApi() || Promise.resolve();
      case 4: return this.stepOptions?.saveToApi() || Promise.resolve();
      case 5: return this.stepAvailability?.saveToApi() || Promise.resolve();
      case 6: return this.stepInclusions?.saveToApi() || Promise.resolve();
      case 7: return this.stepPolicies?.saveToApi() || Promise.resolve();
      case 8: return Promise.resolve();
      default: return Promise.resolve();
    }
  }
}
