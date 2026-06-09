import { Component, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { GuideProfileService } from '../../../core/services/guide-profile.service';
import { AuthService } from '../../../core/services/auth.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-policies-verification',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './policies-verification.component.html',
  styleUrl: './policies-verification.component.scss',
})
export class PoliciesVerificationComponent implements OnInit {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  cancellationWindow = '24 hours before';
  latePolicyNotes = '';
  safetyNotes = '';
  uniqueDescription = '';

  kycStatus = 'Pending';
  guideId: number | null = null;

  cancellationWindows = ['24 hours before', '48 hours before', '72 hours before', '1 week before'];

  saving = false;
  submitting = false;
  showDeactivateConfirm = false;
  deactivating = false;
  toast: { message: string; type: 'success' | 'error' } | null = null;
  private toastTimer: any;

  showToast(message: string, type: 'success' | 'error' = 'success'): void {
    clearTimeout(this.toastTimer);
    this.toast = { message, type };
    this.toastTimer = setTimeout(() => { this.toast = null; }, 3500);
  }

  constructor(
    private guideService: GuideProfileService,
    private auth: AuthService,
    private http: HttpClient,
  ) {}

  ngOnInit(): void {
    const user = this.auth.user();
    this.kycStatus = user?.status ?? 'Active';

    this.guideService.profile$.subscribe(p => {
      if (!p) return;
      this.guideId = p.id;
      this.cancellationWindow = p.cancellation_window;
      this.latePolicyNotes = p.late_policy_notes;
      this.safetyNotes = p.safety_notes;
      this.uniqueDescription = p.unique_description;
    });
  }

  get profileUrl(): string {
    return this.guideId ? `paris-escape.com/guide/${this.guideId}` : 'paris-escape.com/guide/...';
  }

  save(): void {
    this.saving = true;
    this.guideService.patch({
      cancellation_window: this.cancellationWindow,
      late_policy_notes: this.latePolicyNotes,
      safety_notes: this.safetyNotes,
    }).subscribe({
      next: () => { this.saving = false; this.showToast('Policies saved!'); },
      error: () => { this.saving = false; this.showToast('Failed to save policies.', 'error'); },
    });
  }

  copyProfileUrl(): void {
    if (!this.isBrowser) return;
    navigator.clipboard.writeText(this.profileUrl).catch(() => {});
  }

  confirmDeactivate(): void {
    this.showDeactivateConfirm = true;
  }

  cancelDeactivate(): void {
    this.showDeactivateConfirm = false;
  }

  doDeactivate(): void {
    this.deactivating = true;
    this.http.delete(`${environment.apiUrl}/users/delete_account/`).subscribe({
      next: () => {
        this.auth.logout();
      },
      error: () => {
        this.deactivating = false;
        this.showDeactivateConfirm = false;
      },
    });
  }

  submitForReview(): void {
    if (!this.uniqueDescription?.trim()) {
      this.showToast('Please describe what makes your experience unique.', 'error');
      return;
    }
    this.submitting = true;
    this.guideService.patch({ unique_description: this.uniqueDescription }).subscribe({
      next: () => { this.submitting = false; this.showToast('Submitted for review! We\'ll get back to you shortly.'); },
      error: () => { this.submitting = false; this.showToast('Submission failed. Please try again.', 'error'); },
    });
  }
}
