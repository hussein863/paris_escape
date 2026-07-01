import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { IdEncryptService } from '../../core/services/id-encrypt.service';

@Component({
  selector: 'app-sa-reports',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss'
})
export class SaReportsComponent {
  activeTab: 'guide' | 'experience' | 'conversation' = 'guide';
  reports: any[] = [];
  loading = true;

  panel: any = null;
  panelOpen = false;
  panelLoading = false;
  saving = false;

  constructor(private http: HttpClient, private idEncrypt: IdEncryptService) {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.http.get<any>(`${environment.apiUrl}/superadmin/reports/?type=${this.activeTab}`).subscribe({
      next: (res) => { this.reports = res.results ?? res; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  setTab(tab: 'guide' | 'experience' | 'conversation'): void {
    this.activeTab = tab;
    this.load();
  }

  openPanel(r: any): void {
    this.panel = null;
    this.panelOpen = true;
    this.panelLoading = true;

    this.http.get<any>(`${environment.apiUrl}/superadmin/reports/${r.id}/detail/`).subscribe({
      next: (res) => { this.panel = res; this.panelLoading = false; },
      error: () => { this.panel = { error: true }; this.panelLoading = false; }
    });
  }

  closePanel(): void {
    this.panelOpen = false;
    this.panel = null;
  }

  patch(action: string): void {
    if (!this.panel || this.saving) return;
    this.saving = true;
    this.http.patch<any>(`${environment.apiUrl}/superadmin/reports/${this.panel.id}/`, { action }).subscribe({
      next: (res) => {
        const r = this.reports.find(x => x.id === res.id);
        if (r) r.reviewed = res.reviewed;
        if (this.panel) this.panel.reviewed = res.reviewed;
        this.saving = false;
        if (action !== 'reopen') this.closePanel();
      },
      error: () => { this.saving = false; }
    });
  }

  openGuideProfile(guideProfileId: number): void {
    window.open(`/landing/profil/${this.idEncrypt.encryptId(guideProfileId)}`, '_blank');
  }

  openExperience(expId: number): void {
    window.open(`/landing/experience/${this.idEncrypt.encryptId(expId)}`, '_blank');
  }

  initials(name: string): string {
    const parts = (name || '').trim().split(' ');
    return parts.length >= 2
      ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
      : (name || '?').substring(0, 2).toUpperCase();
  }

  stars(n: number): number[] { return Array(Math.round(n || 0)).fill(0); }
  emptyStars(n: number): number[] { return Array(5 - Math.round(n || 0)).fill(0); }
}
