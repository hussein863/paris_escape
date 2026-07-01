import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { IdEncryptService } from '../../core/services/id-encrypt.service';

@Component({
  selector: 'app-sa-bookings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './bookings.component.html',
  styleUrl: './bookings.component.scss'
})
export class SaBookingsComponent {
  search = '';
  filterStatus = '';
  bookings: any[] = [];
  loading = true;

  panel: any = null;
  panelOpen = false;
  panelLoading = false;

  statusOptions = [
    { value: '', label: 'All statuses' },
    { value: 'Pending', label: 'Pending' },
    { value: 'Confirmed', label: 'Confirmed' },
    { value: 'Cancelled', label: 'Cancelled' },
    { value: 'Disputed', label: 'Disputed' },
  ];

  constructor(private http: HttpClient, private idEncrypt: IdEncryptService) {
    this.load();
  }

  load(): void {
    this.loading = true;
    const params: any = {};
    if (this.filterStatus) params['status'] = this.filterStatus;
    if (this.search)       params['search'] = this.search;

    this.http.get<any>(`${environment.apiUrl}/superadmin/bookings/`, { params }).subscribe({
      next: (res) => { this.bookings = res.results ?? res; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  get filtered(): any[] {
    return this.bookings;
  }

  openPanel(b: any): void {
    this.panel = null;
    this.panelOpen = true;
    this.panelLoading = true;

    this.http.get<any>(`${environment.apiUrl}/superadmin/bookings/${b.id}/`).subscribe({
      next: (res) => { this.panel = res; this.panelLoading = false; },
      error: () => { this.panel = { error: true }; this.panelLoading = false; }
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

  formatCurrency(v: number): string {
    return '€' + (v || 0).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
}
