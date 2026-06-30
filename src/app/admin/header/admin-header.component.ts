import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { MessagingService } from '../../core/services/messaging.service';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-admin-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-header.component.html',
  styleUrl: './admin-header.component.scss'
})
export class AdminHeaderComponent implements OnInit, OnDestroy {
  dropdownOpen = false;
  notifDropdownOpen = false;
  unreadMessages = 0;
  private msgPollInterval: any;
  private notifPollInterval: any;

  constructor(
    public auth: AuthService,
    private router: Router,
    private messaging: MessagingService,
    public notifications: NotificationService,
  ) {}

  ngOnInit(): void {
    this.notifications.loadNotifications();
    this.loadUnreadCount();
    this.msgPollInterval = setInterval(() => this.loadUnreadCount(), 30000);
    this.notifPollInterval = setInterval(() => this.notifications.loadNotifications(), 30000);
  }

  ngOnDestroy(): void {
    clearInterval(this.msgPollInterval);
    clearInterval(this.notifPollInterval);
  }

  private loadUnreadCount(): void {
    this.messaging.getUnreadCount().subscribe({
      next: (count) => { this.unreadMessages = count; },
      error: () => {}
    });
  }

  get totalUnread(): number { return this.notifications.unreadCount() + this.unreadMessages; }

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

  notifIcon(type: string): string {
    const icons: Record<string, string> = {
      new_message: 'fa-message',
      booking_new: 'fa-calendar-plus',
      booking_confirmed: 'fa-calendar-check',
      booking_cancelled: 'fa-calendar-xmark',
      new_review: 'fa-star',
      system: 'fa-bell',
    };
    return icons[type] ?? 'fa-bell';
  }

  onNotifClick(notif: any): void {
    if (!notif.read) this.notifications.markAsRead(notif.id);
    this.notifDropdownOpen = false;
    if (notif.link) this.router.navigate([notif.link]);
  }

  toggleNotifDropdown(): void {
    this.notifDropdownOpen = !this.notifDropdownOpen;
    if (this.notifDropdownOpen) this.dropdownOpen = false;
  }

  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
    if (this.dropdownOpen) this.notifDropdownOpen = false;
  }

  goToProfile(): void { this.dropdownOpen = false; this.router.navigate(['/admin/profile']); }

  logout(): void {
    this.dropdownOpen = false;
    this.auth.logout();
    this.router.navigate(['/landing']);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(e: MouseEvent): void {
    const target = e.target as HTMLElement;
    if (!target.closest('.user-profile')) this.dropdownOpen = false;
    if (!target.closest('.notif-btn-wrap')) this.notifDropdownOpen = false;
  }
}
