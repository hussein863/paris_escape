import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-admin-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-header.component.html',
  styleUrl: './admin-header.component.scss'
})
export class AdminHeaderComponent {
  dropdownOpen = false;

  constructor(public auth: AuthService, private router: Router) {}

  get userName(): string { return this.auth.user()?.name ?? 'Guide'; }
  get userAvatar(): string | null { return this.auth.user()?.avatar_url ?? null; }

  get initials(): string {
    return (this.auth.user()?.name ?? 'G')
      .split(' ')
      .map(n => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }

  toggleDropdown(): void { this.dropdownOpen = !this.dropdownOpen; }

  goToProfile(): void { this.dropdownOpen = false; this.router.navigate(['/admin/profile']); }

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
