import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  isMenuOpen = false;
  dropdownOpen = false;

  navItems = [
    { label: 'Experiences', route: '/landing/experience' },
    { label: 'Guides',      route: '/landing/guides' },
    { label: 'How it works', route: '/landing/experience' },
  ];

  constructor(public auth: AuthService, private router: Router) {}

  get userName(): string { return this.auth.user()?.name?.split(' ')[0] ?? ''; }
  get userAvatar(): string | null { return this.auth.user()?.avatar_url ?? null; }
  get initials(): string {
    return (this.auth.user()?.name ?? 'U').split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  }
  get isGuide(): boolean { return this.auth.user()?.role === 'Guide' || this.auth.user()?.role === 'Admin'; }

  toggleMenu(): void { this.isMenuOpen = !this.isMenuOpen; }
  closeMenu(): void { this.isMenuOpen = false; }
  toggleDropdown(): void { this.dropdownOpen = !this.dropdownOpen; }

  goToDashboard(): void {
    this.dropdownOpen = false;
    this.router.navigate([this.isGuide ? '/admin/dashboard' : '/client/home']);
  }

  logout(): void {
    this.dropdownOpen = false;
    this.auth.logout();
    this.router.navigate(['/landing']);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(e: MouseEvent): void {
    const target = e.target as HTMLElement;
    if (!target.closest('.user-menu') && !target.closest('.user-dropdown')) {
      this.dropdownOpen = false;
    }
  }
}
