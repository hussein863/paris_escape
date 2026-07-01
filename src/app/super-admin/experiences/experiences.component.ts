import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { IdEncryptService } from '../../core/services/id-encrypt.service';

@Component({
  selector: 'app-sa-experiences',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './experiences.component.html',
  styleUrl: './experiences.component.scss'
})
export class SaExperiencesComponent {
  search = '';
  filterStatus = '';
  experiences: any[] = [];
  loading = true;

  panel: any = null;
  panelOpen = false;
  panelLoading = false;

  statusOptions = [
    { value: '', label: 'All statuses' },
    { value: 'Under Review', label: 'Under Review' },
    { value: 'Active', label: 'Active' },
    { value: 'Refused', label: 'Refused' },
    { value: 'Draft', label: 'Draft' },
    { value: 'Paused', label: 'Paused' },
  ];

  constructor(private http: HttpClient, private idEncrypt: IdEncryptService) { this.load(); }

  load(): void {
    this.loading = true;
    const params = this.filterStatus ? `?status=${encodeURIComponent(this.filterStatus)}` : '';
    this.http.get<any>(`${environment.apiUrl}/superadmin/experiences/${params}`).subscribe({
      next: (res) => { this.experiences = res.results ?? res; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  get filtered(): any[] {
    return this.experiences.filter(e =>
      !this.search || e.title?.toLowerCase().includes(this.search.toLowerCase())
    );
  }

  openPanel(e: any): void {
    this.panel = null;
    this.panelOpen = true;
    this.panelLoading = true;

    this.http.get<any>(`${environment.apiUrl}/superadmin/experiences/${e.id}/stats/`).subscribe({
      next: (res) => { this.panel = res; this.panelLoading = false; },
      error: () => { this.panelLoading = false; }
    });
  }

  closePanel(): void {
    this.panelOpen = false;
    this.panel = null;
  }

  openExperience(expId: number): void {
    window.open(`/landing/experience/${this.idEncrypt.encryptId(expId)}`, '_blank');
  }

  openGuideProfile(guideProfileId: number): void {
    window.open(`/landing/profil/${this.idEncrypt.encryptId(guideProfileId)}`, '_blank');
  }

  initials(name: string): string {
    const parts = (name || '').trim().split(' ');
    return parts.length >= 2
      ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
      : (name || '?').substring(0, 2).toUpperCase();
  }

  stars(n: number): number[] { return Array(Math.round(n)).fill(0); }

  updateStatus(id: number, newStatus: string): void {
    this.http.patch(`${environment.apiUrl}/superadmin/experiences/${id}/`, { status: newStatus })
      .subscribe(() => {
        const e = this.experiences.find(x => x.id === id);
        if (e) e.status = newStatus;
        if (this.panel && this.panel.id === id) this.panel.status = newStatus;
      });
  }

  approve(id: number): void  { this.updateStatus(id, 'Active'); }
  refuse(id: number): void   { this.updateStatus(id, 'Refused'); }
  activate(id: number): void { this.updateStatus(id, 'Active'); }
  pause(id: number): void    { this.updateStatus(id, 'Paused'); }
}
