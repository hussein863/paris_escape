import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  menuItems = [
    { label: 'Dashboard', icon: 'tachometer-alt', route: '/super-admin/dashboard' },
    { label: 'Users', icon: 'users', route: '/super-admin/users' },
    { label: 'Business', icon: 'briefcase', route: '/super-admin/business' },
    { label: 'System', icon: 'cog', route: '/super-admin/system' }
  ];

  isMenuOpen = true;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
