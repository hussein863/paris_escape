import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { AdminHeaderComponent } from '../header/admin-header.component';
import { ExperienceService } from '../../core/services/experience.service';
import { IdEncryptService } from '../../core/services/id-encrypt.service';
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
  selectedStatus = 'All Status';
  selectedCategory = 'All Categories';
  openMenuId: number | null = null;

  constructor(
    private router: Router,
    private experienceService: ExperienceService,
    private idEncrypt: IdEncryptService
  ) {}

  ngOnInit(): void {
    this.loadExperiences();
  }

  loadExperiences(): void {
    this.loading = true;
    this.experienceService.list({ search: this.searchQuery }).subscribe({
      next: (res) => {
        this.experiences = res.results;
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

  onSearchChange(): void {
    this.loadExperiences();
  }

  editExperience(exp: Experience): void {
    this.router.navigate(['/admin/experiences/create'], { queryParams: { id: exp.id } });
  }

  deleteExperience(exp: Experience): void {
    if (!confirm(`Delete "${exp.title}"? This action cannot be undone.`)) return;
    this.actionInProgress = true;
    this.experienceService.delete(exp.id).subscribe({
      next: () => {
        this.experiences = this.experiences.filter(e => e.id !== exp.id);
        this.actionInProgress = false;
      },
      error: () => {
        alert('Failed to delete experience.');
        this.actionInProgress = false;
      }
    });
  }

  publishExperience(exp: Experience): void {
    this.actionInProgress = true;
    this.experienceService.update(exp.id, { status: 'Active' }).subscribe({
      next: (updated) => {
        exp.status = updated.status;
        this.actionInProgress = false;
      },
      error: () => {
        alert('Failed to publish experience.');
        this.actionInProgress = false;
      }
    });
  }

  pauseExperience(exp: Experience): void {
    this.actionInProgress = true;
    this.experienceService.update(exp.id, { status: 'Paused' }).subscribe({
      next: (updated) => {
        exp.status = updated.status;
        this.actionInProgress = false;
      },
      error: () => {
        alert('Failed to pause experience.');
        this.actionInProgress = false;
      }
    });
  }

  resumeExperience(exp: Experience): void {
    this.actionInProgress = true;
    this.experienceService.update(exp.id, { status: 'Active' }).subscribe({
      next: (updated) => {
        exp.status = updated.status;
        this.actionInProgress = false;
      },
      error: () => {
        alert('Failed to resume experience.');
        this.actionInProgress = false;
      }
    });
  }

  duplicateExperience(exp: Experience): void {
    this.actionInProgress = true;
    this.experienceService.duplicate(exp.id).subscribe({
      next: (newExp) => {
        this.experiences.unshift(newExp);
        this.actionInProgress = false;
      },
      error: () => {
        alert('Failed to duplicate experience.');
        this.actionInProgress = false;
      }
    });
  }

  previewExperience(exp: Experience): void {
    const encryptedId = this.idEncrypt.encryptId(exp.id);
    window.open(`/landing/experience/${encryptedId}`, '_blank');
  }

  get activeCount() { return this.experiences.filter(e => e.status === 'Active').length; }
  get draftCount() { return this.experiences.filter(e => e.status === 'Draft').length; }
  get originalsCount() { return this.experiences.filter(e => e.status === 'Active').length; }

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
    return this.experiences.filter(e => {
      const matchesTab =
        this.activeTab === 'all' ||
        (this.activeTab === 'active' && e.status === 'Active') ||
        (this.activeTab === 'draft' && e.status === 'Draft');
      const matchesSearch = !this.searchQuery ||
        e.title.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchesStatus = this.selectedStatus === 'All Status' || e.status === this.selectedStatus;
      return matchesTab && matchesSearch && matchesStatus;
    });
  }
}
