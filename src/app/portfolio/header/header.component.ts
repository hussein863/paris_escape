import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface NavItem {
  label: string;
  route: string;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  isMenuOpen = false;

  navItems: NavItem[] = [
    { label: 'Experiences', route: '/landing/experience' },
    { label: 'Guides', route: '/landing/profil' },
    { label: 'Originals', route: '/originals' },
    { label: 'How it works', route: '/how-it-works' },
    { label: 'Pricing', route: '/pricing' },
    { label: 'Contact', route: '/contact' }
  ];

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu(): void {
    this.isMenuOpen = false;
  }
}
