import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { AdminHeaderComponent } from '../header/admin-header.component';
import { GuideProfileService } from '../../core/services/guide-profile.service';
import { AuthService } from '../../core/services/auth.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent, AdminHeaderComponent],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent implements OnInit {
  // ─── UI state ────────────────────────────────────────────────────────────────
  isSidebarOpen = false;
  activeTab = 'profile';
  saving = false;
  saveSuccess = false;
  saveError = '';

  // ─── Profile tab ─────────────────────────────────────────────────────────────
  profileVisibility = 'public';
  displayName = '';
  headline = '';
  companyName = '';
  timezone = '';
  language = '';
  currency = '';
  showEmail = false;
  showPhone = false;

  // ─── Notifications tab ───────────────────────────────────────────────────────
  notifPrefs: any = {};

  // ─── Security tab ────────────────────────────────────────────────────────────
  oldPassword = '';
  newPassword = '';
  newPassword2 = '';

  constructor(
    private guideProfileService: GuideProfileService,
    private authService: AuthService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    // Populate profile fields from the cached user signal
    const user = this.authService.user();
    if (user) {
      this.displayName = user.name ?? '';
      this.language = user.preferred_language ?? '';
      this.currency = user.currency ?? '';
    }

    // Load guide-profile from the API
    this.guideProfileService.load().subscribe({
      next: (profile) => {
        this.headline = profile.bio ?? '';
        this.companyName = profile.company_name ?? '';
        this.timezone = profile.timezone ?? '';
        this.showEmail = profile.show_email_on_profile ?? false;
        this.showPhone = profile.show_phone_on_profile ?? false;
      },
      error: (err) => console.error('Failed to load guide profile', err)
    });

    // Load notification prefs
    this.http.get<any>(`${environment.apiUrl}/users/notification-prefs/`).subscribe({
      next: (prefs) => { this.notifPrefs = prefs; },
      error: (err) => console.error('Failed to load notification prefs', err)
    });

    // Load privacy settings
    this.http.get<any>(`${environment.apiUrl}/users/privacy/`).subscribe({
      next: (privacy) => {
        if (privacy.profile_visible_to_guides !== undefined) {
          this.profileVisibility = privacy.profile_visible_to_guides ? 'public' : 'hidden';
        }
        if (privacy.show_email_on_profile !== undefined) {
          this.showEmail = privacy.show_email_on_profile;
        }
        if (privacy.show_phone_on_profile !== undefined) {
          this.showPhone = privacy.show_phone_on_profile;
        }
      },
      error: (err) => console.error('Failed to load privacy settings', err)
    });
  }

  // ─── UI helpers ──────────────────────────────────────────────────────────────
  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidebar(): void {
    this.isSidebarOpen = false;
  }

  setTab(tab: string): void {
    this.activeTab = tab;
    this.saveSuccess = false;
    this.saveError = '';
  }

  setVisibility(visibility: string): void {
    this.profileVisibility = visibility;
  }

  // ─── Save ─────────────────────────────────────────────────────────────────────
  saveChanges(): void {
    this.saving = true;
    this.saveSuccess = false;
    this.saveError = '';

    if (this.activeTab === 'profile') {
      // Patch guide profile fields
      this.guideProfileService.patch({
        company_name: this.companyName,
        timezone: this.timezone,
        bio: this.headline,
        show_email_on_profile: this.showEmail,
        show_phone_on_profile: this.showPhone
      }).subscribe({
        next: () => {
          // Also patch user fields (name, language, currency)
          this.http.patch(`${environment.apiUrl}/users/me/`, {
            name: this.displayName,
            preferred_language: this.language,
            currency: this.currency
          }).subscribe({
            next: () => {
              this.authService.loadMe().subscribe({
                next: () => { this.saving = false; this.saveSuccess = true; },
                error: () => { this.saving = false; this.saveSuccess = true; }
              });
            },
            error: (err) => {
              this.saving = false;
              this.saveError = err?.error?.detail ?? 'Failed to save user settings.';
            }
          });
        },
        error: (err) => {
          this.saving = false;
          this.saveError = err?.error?.detail ?? 'Failed to save profile settings.';
        }
      });

    } else if (this.activeTab === 'privacy') {
      this.http.patch(`${environment.apiUrl}/users/privacy/`, {
        profile_visible_to_guides: this.profileVisibility === 'public',
        show_email_on_profile: this.showEmail,
        show_phone_on_profile: this.showPhone
      }).subscribe({
        next: () => { this.saving = false; this.saveSuccess = true; },
        error: (err) => {
          this.saving = false;
          this.saveError = err?.error?.detail ?? 'Failed to save privacy settings.';
        }
      });

    } else if (this.activeTab === 'notifications') {
      this.http.patch(`${environment.apiUrl}/users/notification-prefs/`, this.notifPrefs).subscribe({
        next: () => { this.saving = false; this.saveSuccess = true; },
        error: (err) => {
          this.saving = false;
          this.saveError = err?.error?.detail ?? 'Failed to save notification preferences.';
        }
      });

    } else if (this.activeTab === 'security') {
      this.changePassword();

    } else {
      // No-op for tabs without save support yet
      this.saving = false;
    }
  }

  // ─── Password change ─────────────────────────────────────────────────────────
  changePassword(): void {
    if (!this.oldPassword.trim()) {
      this.saveError = 'Current password is required.';
      this.saving = false;
      return;
    }
    if (!this.newPassword.trim() || this.newPassword.length < 8) {
      this.saveError = 'New password must be at least 8 characters.';
      this.saving = false;
      return;
    }
    if (this.newPassword !== this.newPassword2) {
      this.saveError = 'New passwords do not match.';
      this.saving = false;
      return;
    }
    this.http.post(`${environment.apiUrl}/users/change_password/`, {
      old_password: this.oldPassword,
      new_password: this.newPassword
    }).subscribe({
      next: () => {
        this.saving = false;
        this.saveSuccess = true;
        this.oldPassword = '';
        this.newPassword = '';
        this.newPassword2 = '';
      },
      error: (err) => {
        this.saving = false;
        this.saveError = err?.error?.detail ?? 'Failed to change password.';
      }
    });
  }
}
