import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExperienceWizardService } from '../../../../core/services/experience-wizard.service';
import { GuideProfileService } from '../../../../core/services/guide-profile.service';

@Component({
  selector: 'app-step-policies',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './step-policies.component.html',
  styleUrl: './step-policies.component.scss',
})
export class StepPoliciesComponent implements OnInit {
  @Output() dataChange = new EventEmitter<any>();

  constructor(
    private wizardService: ExperienceWizardService,
    private guideProfile: GuideProfileService,
  ) {}

  ngOnInit(): void {
    const saved = this.wizardService.getStepState('policies');
    if (saved) { Object.assign(this.formData, saved); return; }
    const profile = this.guideProfile.snapshot;
    if (profile?.safety_notes) this.formData.safetyNotes = profile.safety_notes;
  }

  saveToApi(): Promise<void> {
    const id = this.wizardService.experienceId;
    if (!id) return Promise.resolve();

    return new Promise((resolve, reject) => {
      this.wizardService.savePolicy(id, {
        cancellation_window: this.formData.cancellationWindow,
        late_arrival_policy: this.formData.lateArrivalPolicy,
        no_show_policy: this.formData.noShowPolicy,
        weather_policy: this.formData.weatherPolicy,
        safety_notes: this.formData.safetyNotes,
        insurance_coverage: this.formData.insuranceCoverage,
        emergency_procedures: this.formData.emergencyProcedures,
        photography_consent: this.formData.photographyConsent,
      }).subscribe({ next: () => resolve(), error: reject });
    });
  }

  formData = {
    cancellationWindow: '48-hours',
    lateArrivalPolicy: 'wait-15',
    noShowPolicy: 'no-refund',
    safetyNotes: 'This experience involves walking on uneven surfaces and cobblestone streets. Participants should be comfortable walking for 2-3 hours with occasional breaks. Please inform us of any mobility concerns in advance.',
    insuranceCoverage: false,
    emergencyProcedures: false,
    weatherPolicy: 'light-rain',
    minimumAge: 'no-restriction',
    maximumAge: 'no-restriction',
    photographyConsent: false
  };

  cancellationOptions = [
    { value: '24-hours', label: '24 hours', badge: 'Standard' },
    { value: '48-hours', label: '48 hours', badge: 'Recommended' },
    { value: '72-hours', label: '72 hours', badge: 'Strict' }
  ];

  lateArrivalOptions = [
    { value: 'wait-15', label: 'Wait up to 15 minutes' },
    { value: 'start-on-time', label: 'Start on time regardless' },
    { value: 'custom', label: 'Custom policy' }
  ];

  noShowOptions = [
    { value: 'no-refund', label: 'No refund for no-shows' },
    { value: 'partial-refund', label: 'Partial refund (50%)' },
    { value: 'custom', label: 'Custom policy' }
  ];

  weatherPolicyOptions = [
    { value: 'light-rain', label: 'Experience continues in light rain' },
    { value: 'cancel-bad', label: 'Cancel in case of bad weather' },
    { value: 'reschedule-severe', label: 'Reschedule for severe weather' }
  ];

  ageOptions = [
    { value: 'no-restriction', label: 'No restriction' },
    { value: '3', label: '3+' },
    { value: '5', label: '5+' },
    { value: '8', label: '8+' },
    { value: '12', label: '12+' },
    { value: '16', label: '16+' },
    { value: '18', label: '18+' },
    { value: '21', label: '21+' }
  ];

  maxAgeOptions = [
    { value: 'no-restriction', label: 'No restriction' },
    { value: '65', label: '65' },
    { value: '70', label: '70' },
    { value: '75', label: '75' },
    { value: '80', label: '80' }
  ];

  policyTips = [
    {
      icon: '<img src="assets/images/question.svg" alt="Question">',
      color: 'green',
      title: 'Clear expectations',
      description: 'Well-defined policies reduce disputes and build trust.'
    },
    {
      icon: 'fa-balance-scale',
      color: 'blue',
      title: 'Fair but firm',
      description: 'Balance traveler flexibility with your business needs.'
    },
    {
      icon: 'fa-heart',
      color: 'red',
      title: 'Safety first',
      description: 'Transparent safety information protects everyone.'
    }
  ];

  cancellationImpact = [
    { hours: '24 hours', status: 'Standard', change: null },
    { hours: '48 hours', status: '+15% bookings', positive: true },
    { hours: '72 hours', status: '-10% bookings', positive: false }
  ];

  legalCompliance = [
    'EU consumer protection',
    'French tourism regulations',
    'GDPR data protection',
    'Accessibility standards'
  ];
  selectPattern(patternId: string): void {
    this.formData.lateArrivalPolicy = patternId;
    this.emitData();
  }
  selectwheather(wheather: string): void {
    this.formData.weatherPolicy = wheather;
    this.emitData();
  }
  get setupProgress() {
    return {
      cancellationPolicy: 'in-progress' as 'not-started' | 'in-progress' | 'completed',
      safetyGuidelines: 'not-started' as 'not-started' | 'in-progress' | 'completed',
      additionalPolicies: 'not-started' as 'not-started' | 'in-progress' | 'completed'
    };
  }

  selectCancellationWindow(value: string): void {
    this.formData.cancellationWindow = value;
    this.emitData();
  }

  onDataChange(): void {
    this.emitData();
  }

  previewExperience(): void {
    /* not implemented */
    // Placeholder for preview functionality
  }

  emitData(): void {
    this.wizardService.saveStepState('policies', this.formData);
    this.dataChange.emit(this.formData);
  }
}

