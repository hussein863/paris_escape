import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { MessagingService } from '../../../core/services/messaging.service';

@Component({
  selector: 'app-client-header',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './client-header.component.html',
  styleUrl: './client-header.component.scss'
})
export class ClientHeaderComponent implements OnInit, OnDestroy {
  searchQuery = '';
  dropdownOpen = false;
  unreadMessages = 0;
  private msgPollInterval: any;

  constructor(
    public auth: AuthService,
    public notifications: NotificationService,
    private router: Router,
    private messaging: MessagingService,
  ) {}

  ngOnInit(): void {
    this.notifications.loadNotifications();
    this.loadUnreadCount();
    this.msgPollInterval = setInterval(() => this.loadUnreadCount(), 30000);
  }

  ngOnDestroy(): void {
    clearInterval(this.msgPollInterval);
  }

  private loadUnreadCount(): void {
    this.messaging.getUnreadCount().subscribe({
      next: (count) => { this.unreadMessages = count; },
      error: () => {}
    });
  }

  get userName(): string { return this.auth.user()?.name ?? 'Traveler'; }
  get userRole(): string { return this.auth.user()?.role ?? 'Customer'; }
  get userAvatar(): string | null { return this.auth.user()?.avatar_url ?? null; }
  get hasNotifications(): boolean { return this.notifications.unreadCount() > 0 || this.unreadMessages > 0; }
  get totalUnread(): number { return this.notifications.unreadCount() + this.unreadMessages; }

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
