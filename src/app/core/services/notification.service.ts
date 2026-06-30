import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export interface Notification {
  id: number;
  type: 'new_message' | 'booking_new' | 'booking_confirmed' | 'booking_cancelled' | 'new_review' | 'system';
  title: string;
  body: string;
  link: string;
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
        this.notifications.set([]);
        this.unreadCount.set(0);
      }
    });
  }

  markAsRead(id: number): void {
    this.http.patch(`${environment.apiUrl}/users/notifications/${id}/`, { read: true }).subscribe({
      next: () => {
        this.notifications.update(list =>
          list.map(n => n.id === id ? { ...n, read: true } : n)
        );
        this.unreadCount.set(this.notifications().filter(n => !n.read).length);
      }
    });
  }

  markAllRead(): void {
    this.http.post(`${environment.apiUrl}/users/notifications/mark-all-read/`, {}).subscribe({
      next: () => {
        this.notifications.update(list => list.map(n => ({ ...n, read: true })));
        this.unreadCount.set(0);
      }
    });
  }
}
