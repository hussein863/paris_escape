import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { IdEncryptService } from '../../core/services/id-encrypt.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit {
  users: any[] = [];
  loading = true;

  filterRole = '';
  filterStatus = '';
  search = '';

  selectedUser: any = null;
  userStats: any = null;
  panelOpen = false;
  statsLoading = false;

  roleOptions = ['Customer', 'Guide', 'Business', 'Admin'];
  statusOptions = ['Active', 'Suspended', 'KYC Pending'];

  constructor(private http: HttpClient, private idEncrypt: IdEncryptService) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    const params: any = {};
    if (this.filterRole)   params['role']   = this.filterRole;
    if (this.filterStatus) params['status'] = this.filterStatus;
    if (this.search)       params['search'] = this.search;

    this.http.get<any>(`${environment.apiUrl}/superadmin/users/`, { params }).subscribe({
      next: (res) => { this.users = res.results ?? res; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  openPanel(user: any): void {
    this.selectedUser = { ...user };
    this.userStats = null;
    this.panelOpen = true;
    this.statsLoading = true;

    this.http.get<any>(`${environment.apiUrl}/superadmin/users/${user.id}/stats/`).subscribe({
      next: (res) => { this.userStats = res; this.statsLoading = false; },
      error: () => { this.statsLoading = false; }
    });
  }

  closePanel(): void {
    this.panelOpen = false;
    this.selectedUser = null;
    this.userStats = null;
  }

  toggleSuspend(): void {
    if (!this.selectedUser) return;
    const newStatus = this.selectedUser.status === 'Suspended' ? 'Active' : 'Suspended';
    this.http.patch<any>(`${environment.apiUrl}/superadmin/users/${this.selectedUser.id}/`, { status: newStatus })
      .subscribe({
        next: (res) => {
          this.selectedUser.status = res.status;
          const u = this.users.find(x => x.id === res.id);
          if (u) u.status = res.status;
        }
      });
  }

  initials(name: string): string {
    const parts = (name || '').trim().split(' ');
    return parts.length >= 2
      ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
      : (name || '?').substring(0, 2).toUpperCase();
  }

  openGuideProfile(user: any): void {
    if (!user.guide_profile_id) return;
    const enc = this.idEncrypt.encryptId(user.guide_profile_id);
    window.open(`/landing/profil/${enc}`, '_blank');
  }

  formatCurrency(value: number): string {
    return '€' + value.toLocaleString('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  }
}
