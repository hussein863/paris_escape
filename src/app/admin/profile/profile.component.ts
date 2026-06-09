import { Component, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { BasicInfoComponent } from './basic-info/basic-info.component';
import { BusinessInfoComponent } from './business-info/business-info.component';
import { LocationMediaComponent } from './location-media/location-media.component';
import { AvailabilityPricingComponent } from './availability-pricing/availability-pricing.component';
import { PoliciesVerificationComponent } from './policies-verification/policies-verification.component';
import { AuthService } from '../../core/services/auth.service';
import { GuideProfileService, GuideProfile } from '../../core/services/guide-profile.service';
import { IdEncryptService } from '../../core/services/id-encrypt.service';
import { AdminHeaderComponent } from '../header/admin-header.component';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SidebarComponent,
    AdminHeaderComponent,
    BasicInfoComponent,
    BusinessInfoComponent,
    LocationMediaComponent,
    AvailabilityPricingComponent,
    PoliciesVerificationComponent,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})

export class ProfileComponent implements OnInit {
  isSidebarOpen = false;
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  profile: GuideProfile | null = null;
  avatarPreview: string | null = null;
  avatarFile: File | null = null;
  avatarSaving = false;
  userName = '';
  editingBio = false;
  bioEditText = '';
  bioSaving = false;

  toast: { message: string; type: 'success' | 'error' | 'info' } | null = null;
  private toastTimer: any;

  showToast(message: string, type: 'success' | 'error' | 'info' = 'success'): void {
    clearTimeout(this.toastTimer);
    this.toast = { message, type };
    this.toastTimer = setTimeout(() => { this.toast = null; }, 3500);
  }

  get profileCompleteness(): number {
    if (!this.profile) return 0;
    const p = this.profile;
    const checks = [
      !!p.bio,
      !!p.years_of_experience,
      p.languages.length > 0,
      p.specialties.length > 0,
      !!p.company_name || !!p.siret,
      !!p.base_city,
      p.meeting_points.length > 0,
      !!p.base_rate,
      !!p.cancellation_window,
    ];
    return Math.round((checks.filter(Boolean).length / checks.length) * 100);
  }

  get incompleteItems(): number {
    return this.checklistItems.filter(i => !i.done).length;
  }

  showChecklist = false;

  get checklistItems(): { label: string; done: boolean; hint: string }[] {
    if (!this.profile) return [];
    const p = this.profile;
    return [
      { label: 'Add a bio', done: !!p.bio, hint: 'Tell travelers who you are and what makes you unique.' },
      { label: 'Set years of experience', done: !!p.years_of_experience, hint: 'Helps build trust with potential customers.' },
      { label: 'Add at least one language', done: p.languages.length > 0, hint: 'Let travelers know which languages you speak.' },
      { label: 'Add at least one specialty', done: p.specialties.length > 0, hint: 'Food, Art, History… what\'s your expertise?' },
      { label: 'Add company or SIRET info', done: !!p.company_name || !!p.siret, hint: 'Required for professional listings.' },
      { label: 'Set your base city', done: !!p.base_city, hint: 'Where are you based? This helps with local search.' },
      { label: 'Add a meeting point', done: p.meeting_points.length > 0, hint: 'Travelers need to know where to meet you.' },
      { label: 'Set your base rate', done: !!p.base_rate, hint: 'A starting price helps travelers plan their budget.' },
      { label: 'Set cancellation policy', done: !!p.cancellation_window, hint: 'Required before your profile goes live.' },
    ];
  }

  constructor(
    private auth: AuthService,
    private guideService: GuideProfileService,
    private http: HttpClient,
    private router: Router,
    private idEncrypt: IdEncryptService,
  ) {}

  ngOnInit(): void {
    const user = this.auth.user();
    this.userName = user?.name ?? '';
    this.avatarPreview = user?.avatar_url ?? user?.avatar ?? null;
    this.guideService.load().subscribe({ next: p => (this.profile = p) });
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidebar(): void {
    this.isSidebarOpen = false;
  }

  onAvatarClick(): void {
    if (!this.isBrowser) return;
    const el = document.getElementById('avatarUpload') as HTMLInputElement;
    el?.click();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      return;
    }
    this.avatarFile = file;
    const reader = new FileReader();
    reader.onload = e => {
      this.avatarPreview = e.target?.result as string;
    };
    reader.readAsDataURL(file);
    // Auto-save immediately
    this.avatarSaving = true;
    const fd = new FormData();
    fd.append('avatar', file);
    this.http.post(`${environment.apiUrl}/users/avatar/`, fd).subscribe({
      next: () => {
        this.avatarSaving = false;
        this.avatarFile = null;
        this.auth.loadMe().subscribe();
        this.showToast('Profile photo updated successfully!');
      },
      error: () => {
        this.avatarSaving = false;
        this.showToast('Failed to upload photo. Please try again.', 'error');
      },
    });
  }

  previewProfile(): void {
    const guideId = this.profile?.id;
    if (!guideId) {
      this.showToast('Please complete your profile first.', 'info');
      return;
    }
    const encryptedId = this.idEncrypt.encryptId(guideId);
    window.open(`/landing/profil/${encryptedId}`, '_blank');
  }

  publishChanges(): void {
    this.showToast('Profile published! Your changes are now live.');
  }

  goToSupport(): void {
    this.router.navigate(['/admin/support']);
  }

  startEditBio(): void {
    this.bioEditText = this.profile?.bio ?? '';
    this.editingBio = true;
  }

  saveBio(): void {
    if (!this.bioEditText.trim()) {
      this.showToast('Bio cannot be empty.', 'error');
      return;
    }
    this.bioSaving = true;
    this.guideService.patch({ bio: this.bioEditText }).subscribe({
      next: () => {
        this.bioSaving = false;
        this.editingBio = false;
        if (this.profile) {
          this.profile.bio = this.bioEditText;
        }
      },
      error: () => {
        this.bioSaving = false;
        this.showToast('Failed to save bio. Please try again.', 'error');
      }
    });
  }

  cancelEditBio(): void {
    this.editingBio = false;
    this.bioEditText = '';
  }
}
