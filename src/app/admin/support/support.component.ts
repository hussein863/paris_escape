import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { AdminHeaderComponent } from '../header/admin-header.component';
import { environment } from '../../../environments/environment';

interface Ticket {
  id: number;
  status: string;
  priority: string;
  title: string;
  opened_date: string;
  last_update: string;
  booking: number | null;
  disputes: any[];
}

@Component({
  selector: 'app-support',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent, AdminHeaderComponent],
  templateUrl: './support.component.html',
  styleUrl: './support.component.scss'
})
export class SupportComponent implements OnInit {
  isSidebarOpen = false;
  activeTab = 'tickets';
  searchQuery = '';
  selectedStatus = 'all';
  selectedPriority = 'all';

  tickets: Ticket[] = [];
  loading = false;

  // New ticket form
  showNewTicketForm = false;
  newTitle = '';
  newPriority = 'Normal';
  submitting = false;
  submitError = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadTickets();
  }

  loadTickets(): void {
    this.loading = true;
    this.http.get<{ results: Ticket[] }>(`${environment.apiUrl}/support/tickets/`).subscribe({
      next: (res) => { this.tickets = res.results; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  submitTicket(): void {
    if (!this.newTitle.trim()) return;
    this.submitting = true;
    this.submitError = '';
    this.http.post<Ticket>(`${environment.apiUrl}/support/tickets/`, {
      title: this.newTitle,
      priority: this.newPriority,
    }).subscribe({
      next: (ticket) => {
        this.tickets.unshift(ticket);
        this.newTitle = '';
        this.newPriority = 'Normal';
        this.showNewTicketForm = false;
        this.submitting = false;
      },
      error: () => { this.submitError = 'Failed to submit ticket.'; this.submitting = false; }
    });
  }

  closeTicket(ticket: Ticket): void {
    this.http.patch<Ticket>(`${environment.apiUrl}/support/tickets/${ticket.id}/`, { status: 'Resolved' }).subscribe({
      next: (updated) => { ticket.status = updated.status; }
    });
  }

  reopenTicket(ticket: Ticket): void {
    this.http.patch<Ticket>(`${environment.apiUrl}/support/tickets/${ticket.id}/`, { status: 'Open' }).subscribe({
      next: (updated) => { ticket.status = updated.status; }
    });
  }

  get filteredTickets(): Ticket[] {
    return this.tickets.filter(t => {
      const matchStatus = this.selectedStatus === 'all' || t.status === this.selectedStatus;
      const matchPriority = this.selectedPriority === 'all' || t.priority === this.selectedPriority;
      const matchSearch = !this.searchQuery || t.title.toLowerCase().includes(this.searchQuery.toLowerCase());
      return matchStatus && matchPriority && matchSearch;
    });
  }

  get openCount(): number { return this.tickets.filter(t => t.status !== 'Resolved').length; }
  get resolvedCount(): number { return this.tickets.filter(t => t.status === 'Resolved').length; }
  get urgentCount(): number { return this.tickets.filter(t => t.priority === 'Urgent' && t.status !== 'Resolved').length; }

  getStatusClass(status: string): string {
    const map: Record<string, string> = {
      'Awaiting my reply': 'awaiting',
      'Pending platform': 'pending',
      'Resolved': 'resolved',
      'Dispute': 'dispute',
      'Open': 'open',
    };
    return map[status] || 'open';
  }

  formatDate(dateStr: string): string {
    const d = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now.getTime() - d.getTime()) / 1000);
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  toggleSidebar(): void { this.isSidebarOpen = !this.isSidebarOpen; }
  closeSidebar(): void { this.isSidebarOpen = false; }
  setTab(tab: string): void { this.activeTab = tab; }
}
