import { Component, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ClientHeaderComponent } from '../client-header/client-header.component';
import { AuthService } from '../../../core/services/auth.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

export interface PhoneCountry {
  name: string;
  code: string; // ISO 2-letter
  dial: string; // +XX
  flag: string; // emoji
}

export const PHONE_COUNTRIES: PhoneCountry[] = [
  { name: 'France',         code: 'FR', dial: '+33',  flag: '🇫🇷' },
  { name: 'United States',  code: 'US', dial: '+1',   flag: '🇺🇸' },
  { name: 'United Kingdom', code: 'GB', dial: '+44',  flag: '🇬🇧' },
  { name: 'Spain',          code: 'ES', dial: '+34',  flag: '🇪🇸' },
  { name: 'Germany',        code: 'DE', dial: '+49',  flag: '🇩🇪' },
  { name: 'Italy',          code: 'IT', dial: '+39',  flag: '🇮🇹' },
  { name: 'Portugal',       code: 'PT', dial: '+351', flag: '🇵🇹' },
  { name: 'Netherlands',    code: 'NL', dial: '+31',  flag: '🇳🇱' },
  { name: 'Belgium',        code: 'BE', dial: '+32',  flag: '🇧🇪' },
  { name: 'Switzerland',    code: 'CH', dial: '+41',  flag: '🇨🇭' },
  { name: 'Morocco',        code: 'MA', dial: '+212', flag: '🇲🇦' },
  { name: 'Algeria',        code: 'DZ', dial: '+213', flag: '🇩🇿' },
  { name: 'Tunisia',        code: 'TN', dial: '+216', flag: '🇹🇳' },
  { name: 'Saudi Arabia',   code: 'SA', dial: '+966', flag: '🇸🇦' },
  { name: 'UAE',            code: 'AE', dial: '+971', flag: '🇦🇪' },
  { name: 'Canada',         code: 'CA', dial: '+1',   flag: '🇨🇦' },
  { name: 'China',          code: 'CN', dial: '+86',  flag: '🇨🇳' },
  { name: 'Japan',          code: 'JP', dial: '+81',  flag: '🇯🇵' },
  { name: 'Brazil',         code: 'BR', dial: '+55',  flag: '🇧🇷' },
  { name: 'Australia',      code: 'AU', dial: '+61',  flag: '🇦🇺' },
];

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, ClientHeaderComponent],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  activeTab: 'profile' | 'account' | 'notifications' | 'privacy' | 'security' = 'profile';

  phoneCountries = PHONE_COUNTRIES;

  // ─── Profile ────────────────────────────────────────────────────────────────
  avatarPreview: string | null = null;
  avatarFile: File | null = null;
  name = '';
  email = '';
  phoneCountry: PhoneCountry = PHONE_COUNTRIES[0];
  phoneNumber = '';
  country = '';
  city = '';
  preferredLanguage = 'EN';
  currency = 'EUR';
  emergencyContactName = '';
  emergencyPhoneCountry: PhoneCountry = PHONE_COUNTRIES[0];
  emergencyPhoneNumber = '';

  languages = [
    { code: 'EN', label: 'English 🇬🇧' },
    { code: 'FR', label: 'French 🇫🇷' },
    { code: 'ES', label: 'Spanish 🇪🇸' },
    { code: 'DE', label: 'German 🇩🇪' },
    { code: 'IT', label: 'Italian 🇮🇹' },
    { code: 'AR', label: 'Arabic 🇸🇦' },
    { code: 'ZH', label: 'Chinese 🇨🇳' },
  ];
  currencies = [
    { code: 'EUR', label: 'Euro (€)' },
    { code: 'USD', label: 'US Dollar ($)' },
    { code: 'GBP', label: 'British Pound (£)' },
  ];
  countries = ['France', 'United States', 'United Kingdom', 'Spain', 'Germany', 'Italy', 'Morocco', 'Tunisia', 'Algeria', 'UAE', 'Saudi Arabia', 'Canada', 'Australia'];

  profileSaving = false;
  profileSuccess = false;
  profileError = '';

  // ─── Account ────────────────────────────────────────────────────────────────
  newEmail = '';
  emailPassword = '';
  emailSaving = false;
  emailSuccess = false;
  emailError = '';
  connectedAccounts: { id: number; provider: string; email: string; connected_at: string }[] = [];
  showDeactivateConfirm = false;
  deactivating = false;
  downloadingData = false;

  // ─── Notifications ──────────────────────────────────────────────────────────
  notifPrefs: any = {
    email_booking_confirmation: true,
    email_booking_reminder: true,
    email_new_message: true,
    email_review_request: true,
    email_promotions: false,
    email_platform_updates: true,
    push_enabled: true,
    push_messages: true,
    push_booking_updates: true,
  };
  notifSaving = false;
  notifSuccess = false;

  // ─── Privacy ────────────────────────────────────────────────────────────────
  privacySettings: any = {
    profile_visible_to_guides: true,
    show_reviews_publicly: true,
    share_data_for_analytics: false,
    allow_review_usage: true,
    analytics_cookies: true,
    marketing_cookies: false,
  };
  privacySaving = false;
  privacySuccess = false;

  // ─── Security ───────────────────────────────────────────────────────────────
  oldPassword = '';
  newPassword = '';
  newPassword2 = '';
  passwordSaving = false;
  passwordSuccess = false;
  passwordError = '';
  showOldPwd = false;
  showNewPwd = false;
  sessions: { id: number; device: string; ip_address: string; location: string; last_used: string; is_current: boolean }[] = [];
  revokeAllLoading = false;

  constructor(private auth: AuthService, private http: HttpClient, private router: Router) {}

  goToSupport(): void { this.router.navigate(['/admin/support']); }

  ngOnInit(): void {
    this.auth.loadMe().subscribe({ next: () => this.populateProfile() });
    this.loadNotifPrefs();
    this.loadPrivacySettings();
    this.loadConnectedAccounts();
    this.loadSessions();
  }

  private populateProfile(): void {
    const user = this.auth.user();
    if (!user) return;
    this.name = user.name;
    this.email = user.email;
    this.avatarPreview = user.avatar_url ?? user.avatar ?? null;
    this.country = user.country ?? '';
    this.city = user.city ?? '';
    this.preferredLanguage = user.preferred_language ?? 'EN';
    this.currency = user.currency ?? 'EUR';
    this.emergencyContactName = user.emergency_contact_name ?? '';
    this.parsePhone(user.phone ?? '', false);
    this.parsePhone(user.emergency_contact_phone ?? '', true);
  }

  private parsePhone(val: string, isEmergency: boolean): void {
    const parts = val.trim().split(' ');
    const dial = parts[0] ?? '';
    const number = parts.slice(1).join(' ');
    const found = this.phoneCountries.find(c => c.dial === dial) ?? this.phoneCountries[0];
    if (isEmergency) {
      this.emergencyPhoneCountry = found;
      this.emergencyPhoneNumber = number;
    } else {
      this.phoneCountry = found;
      this.phoneNumber = number;
    }
  }

  setActiveTab(tab: typeof this.activeTab): void { this.activeTab = tab; }

  // ─── Profile Photo ──────────────────────────────────────────────────────────
  get initials(): string {
    return (this.name || 'U').split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  }

  triggerAvatarUpload(): void {
    if (!this.isBrowser) return;
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e: any) => {
      const file: File = e.target.files[0];
      if (!file) return;
      this.avatarFile = file;
      const reader = new FileReader();
      reader.onload = (ev: any) => { this.avatarPreview = ev.target.result; };
      reader.readAsDataURL(file);
    };
    input.click();
  }

  removeAvatar(): void {
    this.http.delete(`${environment.apiUrl}/users/avatar/`).subscribe({
      next: () => {
        this.avatarPreview = null;
        this.avatarFile = null;
        this.auth.loadMe().subscribe();
      },
      error: () => { this.avatarPreview = null; this.avatarFile = null; }
    });
  }

  private uploadAvatar(): Promise<void> {
    if (!this.avatarFile) return Promise.resolve();
    const formData = new FormData();
    formData.append('avatar', this.avatarFile);
    return new Promise((resolve, reject) => {
      this.http.post(`${environment.apiUrl}/users/avatar/`, formData).subscribe({
        next: () => { this.avatarFile = null; resolve(); },
        error: reject
      });
    });
  }

  // ─── Save Profile ───────────────────────────────────────────────────────────
  async saveProfile(): Promise<void> {
    this.profileSaving = true;
    this.profileSuccess = false;
    this.profileError = '';

    const payload = {
      name: this.name,
      phone: `${this.phoneCountry.dial} ${this.phoneNumber}`.trim(),
      country: this.country,
      city: this.city,
      preferred_language: this.preferredLanguage,
      currency: this.currency,
      emergency_contact_name: this.emergencyContactName,
      emergency_contact_phone: `${this.emergencyPhoneCountry.dial} ${this.emergencyPhoneNumber}`.trim()
    };

    try {
      await this.uploadAvatar();
      await new Promise<void>((resolve, reject) => {
        this.http.patch(`${environment.apiUrl}/users/me/`, payload).subscribe({
          next: () => { this.auth.loadMe().subscribe(); resolve(); },
          error: reject
        });
      });
      this.profileSaving = false;
      this.profileSuccess = true;
      setTimeout(() => this.profileSuccess = false, 3000);
    } catch (err: any) {
      this.profileError = err?.error?.detail ?? 'Failed to save. Please try again.';
      this.profileSaving = false;
    }
  }

  // ─── Change Email ───────────────────────────────────────────────────────────
  changeEmail(): void {
    this.emailSaving = true;
    this.emailSuccess = false;
    this.emailError = '';
    this.http.post(`${environment.apiUrl}/users/change_email/`, {
      new_email: this.newEmail, password: this.emailPassword
    }).subscribe({
      next: () => {
        this.emailSaving = false;
        this.emailSuccess = true;
        this.auth.loadMe().subscribe();
        this.newEmail = '';
        this.emailPassword = '';
        setTimeout(() => this.emailSuccess = false, 3000);
      },
      error: (err) => {
        this.emailError = err.error?.new_email?.[0] ?? err.error?.password?.[0] ?? err.error?.detail ?? 'Failed.';
        this.emailSaving = false;
      }
    });
  }

  // ─── Deactivate account ───────────────────────────────────────────────────────
  confirmDeactivate(): void {
    this.deactivating = true;
    this.http.request('delete', `${environment.apiUrl}/users/delete_account/`).subscribe({
      next: () => {
        this.auth.logout();
        window.location.href = '/landing';
      },
      error: () => { this.deactivating = false; }
    });
  }

  // ─── Download my data ─────────────────────────────────────────────────────────
  downloadMyData(): void {
    this.downloadingData = true;
    this.http.get(`${environment.apiUrl}/users/export_data/`).subscribe({
      next: (data) => {
        if (this.isBrowser) {
          const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'paris-escape-my-data.json';
          a.click();
          URL.revokeObjectURL(url);
        }
        this.downloadingData = false;
      },
      error: () => { this.downloadingData = false; }
    });
  }

  // ─── Password strength ────────────────────────────────────────────────────────
  get passwordStrength(): { score: number; label: string; cls: string } {
    const p = this.newPassword;
    if (!p) return { score: 0, label: '', cls: '' };
    let score = 0;
    if (p.length >= 8) score++;
    if (p.length >= 12) score++;
    if (/[A-Z]/.test(p) && /[a-z]/.test(p)) score++;
    if (/\d/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    score = Math.min(score, 4);
    const map = [
      { label: '', cls: '' },
      { label: 'Weak', cls: 'weak' },
      { label: 'Fair', cls: 'fair' },
      { label: 'Good', cls: 'good' },
      { label: 'Strong', cls: 'strong' },
    ];
    return { score, ...map[score] };
  }

  get passwordsMatch(): boolean | null {
    if (!this.newPassword2) return null;
    return this.newPassword === this.newPassword2;
  }

  // ─── Notifications ──────────────────────────────────────────────────────────
  loadNotifPrefs(): void {
    this.http.get(`${environment.apiUrl}/users/notification-prefs/`).subscribe({
      next: (prefs: any) => { this.notifPrefs = prefs; }
    });
  }

  saveNotifPrefs(): void {
    this.notifSaving = true;
    this.http.patch(`${environment.apiUrl}/users/notification-prefs/`, this.notifPrefs).subscribe({
      next: (updated: any) => {
        this.notifPrefs = updated;
        this.notifSaving = false;
        this.notifSuccess = true;
        setTimeout(() => this.notifSuccess = false, 3000);
      },
      error: () => { this.notifSaving = false; }
    });
  }

  resetNotifPrefs(): void {
    this.http.delete(`${environment.apiUrl}/users/notification-prefs/`).subscribe({
      next: (defaults: any) => { this.notifPrefs = defaults; }
    });
  }

  // ─── Privacy ────────────────────────────────────────────────────────────────
  loadPrivacySettings(): void {
    this.http.get(`${environment.apiUrl}/users/privacy/`).subscribe({
      next: (s: any) => { this.privacySettings = s; }
    });
  }

  savePrivacy(): void {
    this.privacySaving = true;
    this.http.patch(`${environment.apiUrl}/users/privacy/`, this.privacySettings).subscribe({
      next: (updated: any) => {
        this.privacySettings = updated;
        this.privacySaving = false;
        this.privacySuccess = true;
        setTimeout(() => this.privacySuccess = false, 3000);
      },
      error: () => { this.privacySaving = false; }
    });
  }

  resetPrivacy(): void {
    this.http.delete(`${environment.apiUrl}/users/privacy/`).subscribe({
      next: (defaults: any) => { this.privacySettings = defaults; }
    });
  }

  // ─── Change Password ────────────────────────────────────────────────────────
  // ─── Connected Accounts ─────────────────────────────────────────────────────
  loadConnectedAccounts(): void {
    this.http.get<any[]>(`${environment.apiUrl}/users/connected-accounts/`).subscribe({
      next: (list) => { this.connectedAccounts = list; },
      error: () => {}
    });
  }

  isConnected(provider: string): boolean {
    return this.connectedAccounts.some(a => a.provider === provider);
  }

  disconnectAccount(provider: string): void {
    this.http.delete(`${environment.apiUrl}/users/connected-accounts/${provider}/`).subscribe({
      next: () => { this.connectedAccounts = this.connectedAccounts.filter(a => a.provider !== provider); }
    });
  }

  // ─── Sessions ────────────────────────────────────────────────────────────────
  loadSessions(): void {
    this.http.get<any[]>(`${environment.apiUrl}/users/sessions/`).subscribe({
      next: (list) => { this.sessions = list; },
      error: () => {}
    });
  }

  revokeSession(id: number): void {
    this.http.delete(`${environment.apiUrl}/users/sessions/${id}/`).subscribe({
      next: () => { this.sessions = this.sessions.filter(s => s.id !== id); }
    });
  }

  revokeAllOtherSessions(): void {
    this.revokeAllLoading = true;
    this.http.delete(`${environment.apiUrl}/users/sessions/all/`).subscribe({
      next: () => {
        this.sessions = this.sessions.filter(s => s.is_current);
        this.revokeAllLoading = false;
      },
      error: () => { this.revokeAllLoading = false; }
    });
  }

  getLocation(): string { return 'Paris, France'; }

  changePassword(): void {
    if (!this.oldPassword.trim()) {
      this.passwordError = 'Current password is required.';
      return;
    }
    if (!this.newPassword.trim() || this.newPassword.length < 8) {
      this.passwordError = 'New password must be at least 8 characters.';
      return;
    }
    if (this.newPassword !== this.newPassword2) {
      this.passwordError = 'Passwords do not match.';
      return;
    }
    this.passwordSaving = true;
    this.passwordSuccess = false;
    this.passwordError = '';
    this.http.post(`${environment.apiUrl}/users/change_password/`, {
      old_password: this.oldPassword, new_password: this.newPassword
    }).subscribe({
      next: () => {
        this.passwordSaving = false;
        this.passwordSuccess = true;
        this.oldPassword = '';
        this.newPassword = '';
        this.newPassword2 = '';
        setTimeout(() => this.passwordSuccess = false, 3000);
      },
      error: (err) => {
        this.passwordError = err.error?.old_password ?? err.error?.detail ?? 'Failed.';
        this.passwordSaving = false;
      }
    });
  }
}
