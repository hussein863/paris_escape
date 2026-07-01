import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-sa-kyc',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './kyc.component.html',
  styleUrl: './kyc.component.scss'
})
export class SaKycComponent {
  search = '';
  filterStatus = '';
  guides: any[] = [];
  loading = true;

  panel: any = null;
  panelOpen = false;
  panelLoading = false;
  saving = false;

  statusOptions = [
    { value: '', label: 'All statuses' },
    { value: 'not-started', label: 'Not started' },
    { value: 'in-review', label: 'In review' },
    { value: 'verified', label: 'Verified' },
  ];

  docCategories = ['Identity', 'Address', 'Business & Tax', 'Bank Account'];

  constructor(private http: HttpClient) { this.load(); }

  load(): void {
    const params: any = {};
    if (this.filterStatus) params['status'] = this.filterStatus;
    this.http.get<any>(`${environment.apiUrl}/superadmin/kyc/`, { params }).subscribe({
      next: (res) => { this.guides = res.results ?? res; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  get filtered(): any[] {
    return this.guides.filter(g => {
      const matchSearch = !this.search ||
        g.guide_name?.toLowerCase().includes(this.search.toLowerCase()) ||
        g.guide_email?.toLowerCase().includes(this.search.toLowerCase());
      const matchStatus = !this.filterStatus || g.verification_status === this.filterStatus;
      return matchSearch && matchStatus;
    });
  }

  openPanel(guide: any): void {
    this.panel = null;
    this.panelOpen = true;
    this.panelLoading = true;

    this.http.get<any>(`${environment.apiUrl}/superadmin/kyc/${guide.user_id}/`).subscribe({
      next: (res) => { this.panel = res; this.panelLoading = false; },
      error: () => {
        this.panel = { error: true };
        this.panelLoading = false;
      }
    });
  }

  closePanel(): void {
    this.panelOpen = false;
    this.panel = null;
  }

  docsForCategory(cat: string): any[] {
    return (this.panel?.documents ?? []).filter((d: any) => d.category === cat);
  }

  approve(): void {
    this.updateStatus('verified');
  }

  requestMoreInfo(): void {
    this.updateStatus('in-review');
  }

  private updateStatus(newStatus: string): void {
    if (!this.panel || this.saving) return;
    this.saving = true;
    this.http.patch<any>(`${environment.apiUrl}/superadmin/kyc/${this.panel.user_id}/`, {
      verification_status: newStatus
    }).subscribe({
      next: (res) => {
        this.panel.verification_status = res.verification_status;
        const g = this.guides.find(x => x.user_id === this.panel.user_id);
        if (g) {
          g.verification_status = res.verification_status;
          if (newStatus === 'verified') g.is_verified = true;
        }
        this.saving = false;
        this.closePanel();
        this.load();
      },
      error: () => { this.saving = false; }
    });
  }

  statusLabel(s: string): string {
    return ({ 'not-started': 'Not Started', 'in-review': 'In Review', 'verified': 'Verified' } as any)[s] ?? s;
  }

  isImage(url: string): boolean {
    return /\.(jpg|jpeg|png|gif|webp)$/i.test(url ?? '');
  }
}
