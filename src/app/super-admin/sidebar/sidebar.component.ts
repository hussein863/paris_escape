import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-sa-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  collapsed = false;

  readonly userName = computed(() => this.auth.user()?.name ?? 'Admin');
  readonly initials = computed(() => {
    const parts = (this.auth.user()?.name ?? 'SA').trim().split(/\s+/);
    return ((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')).toUpperCase();
  });
  readonly userAvatar = computed(() => this.auth.user()?.avatar_url ?? '');

  menuItems = [
    { label: 'Dashboard',    icon: 'gauge-high',      route: '/super-admin/dashboard' },
    { label: 'Users',        icon: 'users',           route: '/super-admin/users' },
    { label: 'KYC',          icon: 'id-card',         route: '/super-admin/kyc' },
    { label: 'Experiences',  icon: 'map',             route: '/super-admin/experiences' },
    { label: 'Bookings',     icon: 'calendar-check',  route: '/super-admin/bookings' },
    { label: 'Reports',      icon: 'flag',            route: '/super-admin/reports' },
    { label: 'Reviews',      icon: 'star',            route: '/super-admin/reviews' },
    { label: 'Financials',   icon: 'chart-line',      route: '/super-admin/financials' },
    { label: 'Plans',        icon: 'layer-group',     route: '/super-admin/plans' },
    { label: 'Support',      icon: 'headset',         route: '/super-admin/support' },
    { label: 'Settings',     icon: 'gear',            route: '/super-admin/settings' },
  ];

  constructor(private auth: AuthService) {}

  toggle(): void { this.collapsed = !this.collapsed; }
}
