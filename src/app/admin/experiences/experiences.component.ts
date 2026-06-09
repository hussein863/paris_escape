import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { AdminHeaderComponent } from '../header/admin-header.component';
import { ExperienceService } from '../../core/services/experience.service';
import { IdEncryptService } from '../../core/services/id-encrypt.service';
import { GuideProfileService } from '../../core/services/guide-profile.service';
import { Experience } from '../../core/models';

@Component({
  selector: 'app-experiences',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent, AdminHeaderComponent],
  templateUrl: './experiences.component.html',
  styleUrl: './experiences.component.scss',
})
export class ExperiencesComponent implements OnInit {
  isSidebarOpen = false;
  experiences: Experience[] = [];
  loading = false;
  error = '';
  actionInProgress = false;

  activeTab = 'all';
  searchQuery = '';
  selectedCategory = '';
  openMenuId: number | null = null;
  guideEncryptedId = '';
  categories: string[] = [];

  toast: { message: string; type: 'success' | 'error' | 'confirm'; onConfirm?: () => void } | null = null;
  private toastTimer: any;

  showToast(message: string, type: 'success' | 'error' = 'success'): void {
    clearTimeout(this.toastTimer);
    this.toast = { message, type };
    this.toastTimer = setTimeout(() => { this.toast = null; }, 3500);
  }

  showConfirm(message: string, onConfirm: () => void): void {
    clearTimeout(this.toastTimer);
    this.toast = { message, type: 'confirm', onConfirm };
  }

  confirmAction(): void {
    if (this.toast?.onConfirm) this.toast.onConfirm();
    this.toast = null;
  }

  dismissToast(): void {
    clearTimeout(this.toastTimer);
    this.toast = null;
  }

  constructor(
    private router: Router,
    private experienceService: ExperienceService,
    private idEncrypt: IdEncryptService,
    private guideService: GuideProfileService,
  ) {}

  ngOnInit(): void {
    this.loadExperiences();
    // Load guide profile to get encrypted ID for preview
    this.guideService.load().subscribe({
      next: (profile) => {
        this.guideEncryptedId = this.idEncrypt.encryptId(profile.id);
        // Build category list from experiences
        this.guideService.profile$.subscribe(() => {});
      }
    });
  }

  loadExperiences(): void {
    this.loading = true;
    this.experienceService.list({}).subscribe({
      next: (res) => {
        this.experiences = res.results;
        // Build unique category list from actual experiences
        this.categories = [...new Set(res.results.map((e: Experience) => e.category).filter(Boolean))];
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load experiences.';
        this.loading = false;
      }
    });
  }

  toggleSidebar(): void { this.isSidebarOpen = !this.isSidebarOpen; }
  closeSidebar(): void { this.isSidebarOpen = false; }
  createExperience(): void { this.router.navigate(['/admin/experiences/create']); }
  setActiveTab(tab: string): void { this.activeTab = tab; }
  onSearchChange(): void { /* filtering is done client-side via filteredExperiences getter */ }

  previewPublicProfile(): void {
    if (this.guideEncryptedId) {
      window.open(`/landing/profil/${this.guideEncryptedId}`, '_blank');
    }
  }

  editExperience(exp: Experience): void {
    this.router.navigate(['/admin/experiences/create'], { queryParams: { id: exp.id } });
  }

  deleteExperience(exp: Experience): void {
    this.showConfirm(`Delete "${exp.title}"? This action cannot be undone.`, () => {
      this.actionInProgress = true;
      this.experienceService.delete(exp.id).subscribe({
        next: () => {
          this.experiences = this.experiences.filter(e => e.id !== exp.id);
          this.actionInProgress = false;
          this.showToast(`"${exp.title}" has been deleted.`);
        },
        error: () => {
          this.actionInProgress = false;
          this.showToast('Failed to delete experience.', 'error');
        }
      });
    });
  }

  publishExperience(exp: Experience): void {
    this.actionInProgress = true;
    this.experienceService.update(exp.id, { status: 'Active' }).subscribe({
      next: (updated) => {
        exp.status = updated.status;
        this.actionInProgress = false;
        this.showToast(`"${exp.title}" is now live!`);
      },
      error: () => { this.actionInProgress = false; this.showToast('Failed to publish experience.', 'error'); }
    });
  }

  pauseExperience(exp: Experience): void {
    this.actionInProgress = true;
    this.experienceService.update(exp.id, { status: 'Paused' }).subscribe({
      next: (updated) => {
        exp.status = updated.status;
        this.actionInProgress = false;
        this.showToast(`"${exp.title}" has been paused.`);
      },
      error: () => { this.actionInProgress = false; this.showToast('Failed to pause experience.', 'error'); }
    });
  }

  resumeExperience(exp: Experience): void {
    this.actionInProgress = true;
    this.experienceService.update(exp.id, { status: 'Active' }).subscribe({
      next: (updated) => {
        exp.status = updated.status;
        this.actionInProgress = false;
        this.showToast(`"${exp.title}" is now active again!`);
      },
      error: () => { this.actionInProgress = false; this.showToast('Failed to resume experience.', 'error'); }
    });
  }

  duplicateExperience(exp: Experience): void {
    this.actionInProgress = true;
    this.experienceService.duplicate(exp.id).subscribe({
      next: (newExp) => {
        this.experiences.unshift(newExp);
        this.actionInProgress = false;
        this.showToast(`"${newExp.title}" created as a copy.`);
      },
      error: () => { this.actionInProgress = false; this.showToast('Failed to duplicate experience.', 'error'); }
    });
  }

  previewExperience(exp: Experience): void {
    const encryptedId = this.idEncrypt.encryptId(exp.id);
    window.open(`/landing/experience/${encryptedId}`, '_blank');
  }

  get activeCount() { return this.experiences.filter(e => e.status === 'Active').length; }
  get draftCount() { return this.experiences.filter(e => e.status === 'Draft').length; }
  get originalsCount() { return this.experiences.filter(e => e.status === 'Active' && (e as any).is_original).length; }

  toggleMoreMenu(expId: number, event: Event): void {
    event.stopPropagation();
    this.openMenuId = this.openMenuId === expId ? null : expId;
  }

  closeMenu(): void {
    this.openMenuId = null;
  }

  goToSupport(): void {
    this.router.navigate(['/admin/support']);
  }

  get filteredExperiences(): Experience[] {
    const q = this.searchQuery.toLowerCase().trim();
    return this.experiences.filter(e => {
      const matchesTab =
        this.activeTab === 'all' ||
        (this.activeTab === 'active' && e.status === 'Active') ||
        (this.activeTab === 'draft' && e.status === 'Draft') ||
        (this.activeTab === 'originals' && e.status === 'Active' && (e as any).is_original);
      const matchesSearch = !q || e.title.toLowerCase().includes(q) || e.category.toLowerCase().includes(q);
      const matchesCategory = !this.selectedCategory || e.category === this.selectedCategory;
      return matchesTab && matchesSearch && matchesCategory;
    });
  }
}
