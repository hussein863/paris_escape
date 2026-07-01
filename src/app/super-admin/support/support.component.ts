import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

interface TicketReply {
  id: number;
  sender_name: string;
  sender_type: 'Guide' | 'Admin';
  message: string;
  created_at: string;
}

interface Ticket {
  id: number;
  title: string;
  user_name: string;
  user_email: string;
  priority: string;
  status: string;
  opened_date: string;
  last_update: string;
  replies?: TicketReply[];
}

@Component({
  selector: 'app-sa-support',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './support.component.html',
  styleUrl: './support.component.scss'
})
export class SaSupportComponent {
  search = '';
  filterStatus = '';
  tickets: Ticket[] = [];
  loading = true;

  panelOpen = false;
  panelLoading = false;
  selectedTicket: Ticket | null = null;
  replyMessage = '';
  newStatus = '';
  replying = false;
  replyError = '';

  statusOptions = [
    { value: '', label: 'All statuses' },
    { value: 'Open', label: 'Open' },
    { value: 'Awaiting my reply', label: 'Awaiting reply' },
    { value: 'Pending platform', label: 'Pending platform' },
    { value: 'Resolved', label: 'Resolved' },
    { value: 'Dispute', label: 'Dispute' },
  ];

  constructor(private http: HttpClient) { this.load(); }

  @HostListener('document:keydown.escape')
  onEsc(): void { if (this.panelOpen) this.closePanel(); }

  load(): void {
    this.http.get<any>(`${environment.apiUrl}/superadmin/support/`).subscribe({
      next: (res) => { this.tickets = res.results ?? res; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  get filtered(): Ticket[] {
    return this.tickets.filter(t => {
      const matchSearch = !this.search ||
        t.title?.toLowerCase().includes(this.search.toLowerCase());
      const matchStatus = !this.filterStatus || t.status === this.filterStatus;
      return matchSearch && matchStatus;
    });
  }

  openPanel(ticket: Ticket): void {
    this.selectedTicket = ticket;
    this.panelOpen = true;
    this.panelLoading = true;
    this.replyMessage = '';
    this.newStatus = ticket.status;
    this.replyError = '';
    this.http.get<Ticket>(`${environment.apiUrl}/superadmin/support/${ticket.id}/`).subscribe({
      next: (full) => {
        this.selectedTicket = full;
        this.newStatus = full.status;
        this.panelLoading = false;
      },
      error: () => { this.panelLoading = false; }
    });
  }

  closePanel(): void {
    this.panelOpen = false;
    setTimeout(() => { this.selectedTicket = null; }, 300);
  }

  saveReply(): void {
    if (!this.selectedTicket) return;
    this.replying = true;
    this.replyError = '';
    const payload: any = {};
    if (this.replyMessage.trim()) payload.message = this.replyMessage.trim();
    if (this.newStatus !== this.selectedTicket.status) payload.status = this.newStatus;
    if (!payload.message && !payload.status) { this.replying = false; return; }
    this.http.patch<any>(`${environment.apiUrl}/superadmin/support/${this.selectedTicket.id}/`, payload).subscribe({
      next: (res) => {
        if (this.selectedTicket) {
          this.selectedTicket.status = res.status;
          if (payload.message) {
            const newReply: TicketReply = {
              id: Date.now(),
              sender_name: 'Support Team',
              sender_type: 'Admin',
              message: payload.message,
              created_at: new Date().toISOString(),
            };
            this.selectedTicket.replies = [...(this.selectedTicket.replies || []), newReply];
          }
          // Update the list
          const t = this.tickets.find(x => x.id === this.selectedTicket!.id);
          if (t) t.status = res.status;
        }
        this.replyMessage = '';
        this.replying = false;
      },
      error: () => {
        this.replyError = 'Failed to save. Please try again.';
        this.replying = false;
      }
    });
  }

  formatDate(dateStr: string): string {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  }
}
