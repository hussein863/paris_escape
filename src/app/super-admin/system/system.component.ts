import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type SystemSection =
  | 'general'
  | 'cms'
  | 'seo'
  | 'analytics'
  | 'integrations'
  | 'roles'
  | 'emails'
  | 'compliance'
  | 'logs';

@Component({
  selector: 'app-system',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './system.component.html',
  styleUrl: './system.component.scss'
})
export class SystemComponent {
  activeSection: SystemSection = 'general';

  // General Settings
  platformName = 'Paris Experiences';
  currency = 'EUR';
  taxRate = 20;

  // SEO
  metaTitle = 'Paris Experiences - Discover Authentic Paris';
  metaDescription = 'Book unique experiences with local guides in Paris';

  // Analytics stats
  sessions = '125,432';
  conversionRate = '3.2%';
  topCity = 'Paris';
  topExperience = 'Night Tour';

  // Integrations
  integrations = [
    { name: 'Stripe', status: 'Active', lastSync: '2 min ago' },
    { name: 'SendGrid', status: 'Active', lastSync: '10 min ago' },
    { name: 'Google Analytics', status: 'Active', lastSync: '1 hour ago' },
    { name: 'AWS S3', status: 'Inactive', lastSync: 'Never' }
  ];

  // Roles
  roles = [
    { name: 'Admin', users: 3, permissions: ['All'] },
    { name: 'Support', users: 8, permissions: ['View Users', 'View Bookings'] },
    { name: 'Finance', users: 2, permissions: ['View Payments', 'Manage Payouts'] },
    { name: 'Read-only', users: 5, permissions: ['View Only'] }
  ];

  // System Health
  systemHealth = {
    uptime: '99.8%',
    errors: 12,
    emailDeliverability: '98.5%',
    backgroundTasks: 'Running'
  };

  menuItems = [
    { id: 'general' as SystemSection, label: 'General Settings', icon: 'cog' },
    { id: 'cms' as SystemSection, label: 'CMS', icon: 'file-alt' },
    { id: 'seo' as SystemSection, label: 'SEO', icon: 'search' },
    { id: 'analytics' as SystemSection, label: 'Analytics', icon: 'chart-bar' },
    { id: 'integrations' as SystemSection, label: 'Integrations / API', icon: 'plug' },
    { id: 'roles' as SystemSection, label: 'Roles & Permissions', icon: 'user-shield' },
    { id: 'emails' as SystemSection, label: 'Emails & Languages', icon: 'envelope' },
    { id: 'compliance' as SystemSection, label: 'Compliance / GDPR', icon: 'lock' },
    { id: 'logs' as SystemSection, label: 'Logs & System Health', icon: 'list-alt' }
  ];

  setActiveSection(section: SystemSection): void {
    this.activeSection = section;
  }

  saveSettings(): void {
    alert('Settings saved successfully!');
  }

  generateSitemap(): void {
    alert('Generating sitemap...');
  }

  exportUserData(): void {
    alert('Exporting user data...');
  }

  deleteUser(): void {
    if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      alert('User deleted successfully.');
    }
  }
}
