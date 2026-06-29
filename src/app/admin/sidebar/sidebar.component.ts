import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MessagingService } from '../../core/services/messaging.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent implements OnInit, OnDestroy {
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
}
