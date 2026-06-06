import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-client-header',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './client-header.component.html',
  styleUrl: './client-header.component.scss'
})
export class ClientHeaderComponent {
  searchQuery = '';
  dropdownOpen = false;

  constructor(public auth: AuthService, private router: Router) {}

  get userName(): string { return this.auth.user()?.name ?? 'Traveler'; }
  get userRole(): string { return this.auth.user()?.role ?? 'Customer'; }
  get userAvatar(): string | null { return this.auth.user()?.avatar_url ?? null; }
  get hasNotifications(): boolean { return false; }

  get initials(): string {
    return (this.auth.user()?.name ?? 'U')
      .split(' ')
      .map(n => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }

  search(): void {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/landing/experience'], { queryParams: { search: this.searchQuery } });
    } else {
      this.router.navigate(['/landing/experience']);
    }
  }

  toggleDropdown(): void { this.dropdownOpen = !this.dropdownOpen; }

  goToSettings(): void { this.dropdownOpen = false; this.router.navigate(['/client/settings']); }

  logout(): void {
    this.dropdownOpen = false;
    this.auth.logout();
    this.router.navigate(['/landing']);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(e: MouseEvent): void {
    const target = e.target as HTMLElement;
    if (!target.closest('.user-profile')) {
      this.dropdownOpen = false;
    }
  }
}
