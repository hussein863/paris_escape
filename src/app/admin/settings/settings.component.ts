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
  bio = '';
  companyName = '';
  timezone = '';
  language = '';
  currency = '';
  showEmail = false;
  showPhone = false;

  // ─── Notifications tab ───────────────────────────────────────────────────────
  notifPrefs: any = {};

  // ─── Calendar & Availability ─────────────────────────────────────────────────
  calendarSettings: any = {
    default_booking_window: 7,
    min_hours_before_booking: 2,
    allow_same_day_bookings: true,
    buffer_between_tours: 30,
    timezone: 'UTC',
    work_days: '1,2,3,4,5',
    work_start_time: '09:00',
    work_end_time: '18:00'
  };

  // ─── Integrations ───────────────────────────────────────────────────────────
  integrations: any = {
    google_calendar_connected: false,
    google_calendar_email: '',
    auto_sync_google_calendar: false,
    stripe_connected: false,
    stripe_account_id: '',
    mailchimp_connected: false
  };

  // ─── Security tab ────────────────────────────────────────────────────────────
  oldPassword = '';
  newPassword = '';
  newPassword2 = '';

  // ─── Danger Zone ────────────────────────────────────────────────────────────
  dangerZone: any = {
    account_deletion_requested: false,
    account_deactivated: false,
    deactivation_reason: ''
  };

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
        this.headline = profile.headline ?? '';
        this.bio = profile.bio ?? '';
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

    // Load calendar settings
    this.http.get<any>(`${environment.apiUrl}/users/calendar-settings/me/`).subscribe({
      next: (cal) => { this.calendarSettings = { ...this.calendarSettings, ...cal }; },
      error: (err) => console.error('Failed to load calendar settings', err)
    });

    // Load integration settings
    this.http.get<any>(`${environment.apiUrl}/users/integration-settings/me/`).subscribe({
      next: (int) => { this.integrations = { ...this.integrations, ...int }; },
      error: (err) => console.error('Failed to load integration settings', err)
    });

    // Load danger zone settings
    this.http.get<any>(`${environment.apiUrl}/users/danger-zone/me/`).subscribe({
      next: (dz) => { this.dangerZone = { ...this.dangerZone, ...dz }; },
      error: (err) => console.error('Failed to load danger zone settings', err)
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
        headline: this.headline,
        bio: this.bio,
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

    } else if (this.activeTab === 'calendar') {
      this.http.patch(`${environment.apiUrl}/users/calendar-settings/me/`, this.calendarSettings).subscribe({
        next: () => { this.saving = false; this.saveSuccess = true; },
        error: (err) => {
          this.saving = false;
          this.saveError = err?.error?.detail ?? 'Failed to save calendar settings.';
        }
      });

    } else if (this.activeTab === 'integrations') {
      this.http.patch(`${environment.apiUrl}/users/integration-settings/me/`, this.integrations).subscribe({
        next: () => { this.saving = false; this.saveSuccess = true; },
        error: (err) => {
          this.saving = false;
          this.saveError = err?.error?.detail ?? 'Failed to save integration settings.';
        }
      });

    } else if (this.activeTab === 'danger-zone') {
      this.http.patch(`${environment.apiUrl}/users/danger-zone/me/`, this.dangerZone).subscribe({
        next: () => { this.saving = false; this.saveSuccess = true; },
        error: (err) => {
          this.saving = false;
          this.saveError = err?.error?.detail ?? 'Failed to update account settings.';
        }
      });

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
