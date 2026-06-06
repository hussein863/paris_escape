import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export interface Notification {
  id: number;
  type: 'booking' | 'message' | 'review' | 'system';
  title: string;
  read: boolean;
  created_at: string;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  unreadCount = signal(0);
  notifications = signal<Notification[]>([]);

  constructor(private http: HttpClient) {}

  loadNotifications(): void {
    this.http.get<{ results: Notification[] }>(`${environment.apiUrl}/users/notifications/`).subscribe({
      next: (res) => {
        this.notifications.set(res.results);
        this.unreadCount.set(res.results.filter(n => !n.read).length);
      },
      error: () => {
        // Notifications endpoint not available, set empty
        this.notifications.set([]);
        this.unreadCount.set(0);
      }
    });
  }

  markAsRead(id: number): void {
    this.http.patch(`${environment.apiUrl}/users/notifications/${id}/`, { read: true }).subscribe({
      next: () => {
        const notif = this.notifications().find(n => n.id === id);
        if (notif) notif.read = true;
        this.unreadCount.set(this.notifications().filter(n => !n.read).length);
      }
    });
  }
}
