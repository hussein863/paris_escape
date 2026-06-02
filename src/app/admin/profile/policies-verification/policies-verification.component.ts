import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-policies-verification',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './policies-verification.component.html',
  styleUrl: './policies-verification.component.scss',
})
export class PoliciesVerificationComponent {
  freeCancellationWindow = '24 hours before';
  latePolicyNotes = '';
  safetyNotes = '';
  uniqueExperienceDescription = '';

  kycStatus = 'Approved';
  kycVerifications = [
    { type: 'ID Document', verified: true, date: '15 Jan 2024' },
    { type: 'Address Proof', verified: true, date: '15 Jan 2024' },
    { type: 'Business Info', verified: true, date: '15 Jan 2024' }
  ];

  profileUrl = 'paris-escape.com/guide/marie-dubois';
  lastUpdated = '2 hours ago by Marie Dubois';

  cancellationWindows = [
    '24 hours before',
    '48 hours before',
    '72 hours before',
    '1 week before'
  ];

  copyProfileUrl() {
    navigator.clipboard.writeText(this.profileUrl);
    alert('Profile URL copied!');
  }

  viewAuditLog() {
    alert('Audit log would open here');
  }

  submitForReview() {
    alert('Application would be submitted for review');
  }

  deactivateProfile() {
    if (confirm('Are you sure you want to deactivate your profile? Your profile will be hidden from public view.')) {
      alert('Profile deactivated');
    }
  }
}
