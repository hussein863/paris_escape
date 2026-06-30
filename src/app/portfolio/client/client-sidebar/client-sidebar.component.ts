import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MessagingService } from '../../../core/services/messaging.service';

@Component({
  selector: 'app-client-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './client-sidebar.component.html',
  styleUrl: './client-sidebar.component.scss',
})
export class ClientSidebarComponent implements OnInit, OnDestroy {
  isOpen = false;
  unreadMessages = 0;
  private pollInterval: any;

  constructor(private messaging: MessagingService) {}

  ngOnInit(): void {
    this.loadUnreadCount();
    this.pollInterval = setInterval(() => this.loadUnreadCount(), 30000);
  }

  ngOnDestroy(): void {
    clearInterval(this.pollInterval);
  }

  private loadUnreadCount(): void {
    this.messaging.getUnreadCount().subscribe({
      next: (count) => { this.unreadMessages = count; },
      error: () => {}
    });
  }

  toggleSidebar(): void {
    this.isOpen = !this.isOpen;
  }

  closeSidebar(): void {
    this.isOpen = false;
  }
}
