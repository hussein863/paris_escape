import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GuideProfileService } from '../../../core/services/guide-profile.service';

@Component({
  selector: 'app-business-info',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './business-info.component.html',
  styleUrl: './business-info.component.scss',
})
export class BusinessInfoComponent implements OnInit {
  companyName = '';
  siret = '';
  vatNumber = '';
  publicEmail = '';
  showEmailOnProfile = false;
  publicPhone = '';
  showPhoneOnProfile = false;

  saving = false;
  toast: { message: string; type: 'success' | 'error' } | null = null;
  private toastTimer: any;

  showToast(message: string, type: 'success' | 'error' = 'success'): void {
    clearTimeout(this.toastTimer);
    this.toast = { message, type };
    this.toastTimer = setTimeout(() => { this.toast = null; }, 3500);
  }

  constructor(private guideService: GuideProfileService) {}

  ngOnInit(): void {
    this.guideService.profile$.subscribe(p => {
      if (!p) return;
      this.companyName = p.company_name;
      this.siret = p.siret;
      this.vatNumber = p.vat_number;
      this.publicEmail = p.public_email;
      this.showEmailOnProfile = p.show_email_on_profile;
      this.publicPhone = p.public_phone;
      this.showPhoneOnProfile = p.show_phone_on_profile;
    });
  }

  save(): void {
    this.saving = true;
    this.guideService.patch({
      company_name: this.companyName,
      siret: this.siret,
      vat_number: this.vatNumber,
      public_email: this.publicEmail,
      show_email_on_profile: this.showEmailOnProfile,
      public_phone: this.publicPhone,
      show_phone_on_profile: this.showPhoneOnProfile,
    }).subscribe({
      next: () => { this.saving = false; this.showToast('Business info saved!'); },
      error: () => { this.saving = false; this.showToast('Failed to save changes.', 'error'); },
    });
  }
}
