import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-sa-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class SaHeaderComponent {
  dropdownOpen = false;

  readonly userName = computed(() => this.auth.user()?.name ?? 'Admin');
  readonly userAvatar = computed(() => this.auth.user()?.avatar_url ?? '');
  readonly initials = computed(() => {
    const parts = (this.auth.user()?.name ?? 'SA').trim().split(/\s+/);
    return ((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')).toUpperCase();
  });

  constructor(private auth: AuthService, private router: Router) {}

  toggleDropdown(): void { this.dropdownOpen = !this.dropdownOpen; }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/auth/login']);
  }
}
