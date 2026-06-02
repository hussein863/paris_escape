import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../sidebar/sidebar.component';

interface Ticket {
  id: string;
  status: string;
  priority: string;
  title: string;
  openedDate: string;
  lastUpdate: string;
  linkedReservation?: string;
  additionalInfo?: string;
  additionalInfoIcon?: string;
  actions: string[];
  feedbackEnabled?: boolean;
}

@Component({
  selector: 'app-support',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent],
  templateUrl: './support.component.html',
  styleUrl: './support.component.scss'
})
export class SupportComponent {
  isSidebarOpen = false;
  activeTab = 'tickets';
  searchQuery = '';
  selectedStatus = 'all';
  selectedSort = 'newest';

  tickets: Ticket[] = [
    {
      id: '#SUP-2847',
      status: 'Awaiting my reply',
      priority: 'Urgent',
      title: 'Payout not received for November bookings',
      openedDate: 'Nov 28, 2024',
      lastUpdate: '2 hours ago',
      linkedReservation: '#RES-4521',
      additionalInfo: 'First response within 24h',
      additionalInfoIcon: 'fas fa-clock',
      actions: ['View Details', 'Add Note']
    },
    {
      id: '#SUP-2832',
      status: 'Pending platform',
      priority: 'Normal',
      title: 'KYC document verification taking longer than expected',
      openedDate: 'Nov 25, 2024',
      lastUpdate: '1 day ago',
      additionalInfo: 'Support team is reviewing your documents',
      additionalInfoIcon: 'fas fa-hourglass-half',
      actions: ['View Details', 'Add Note']
    },
    {
      id: '#SUP-2819',
      status: 'Resolved',
      priority: 'Normal',
      title: 'Calendar sync issue with Google Calendar',
      openedDate: 'Nov 20, 2024',
      lastUpdate: 'Nov 22, 2024',
      actions: ['View Details', 'Reopen'],
      feedbackEnabled: true
    },
    {
      id: '#DIS-1042',
      status: 'Dispute',
      priority: 'Urgent',
      title: 'Traveler no-show dispute for November 15 booking',
      openedDate: 'Nov 16, 2024',
      lastUpdate: '5 days ago',
      linkedReservation: '#RES-4398',
      additionalInfo: 'Under review by dispute resolution team',
      additionalInfoIcon: 'fas fa-gavel',
      actions: ['View Details', 'Add Evidence']
    },
    {
      id: '#SUP-2805',
      status: 'Open',
      priority: 'Normal',
      title: 'Question about Originals program eligibility',
      openedDate: 'Nov 18, 2024',
      lastUpdate: '3 days ago',
      additionalInfo: 'Awaiting support response',
      additionalInfoIcon: 'fas fa-share',
      actions: ['View Details', 'Close Ticket']
    }
  ];

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidebar(): void {
    this.isSidebarOpen = false;
  }

  setTab(tab: string): void {
    this.activeTab = tab;
  }

  getStatusClass(status: string): string {
    const statusMap: { [key: string]: string } = {
      'Awaiting my reply': 'awaiting',
      'Pending platform': 'pending',
      'Resolved': 'resolved',
      'Dispute': 'dispute',
      'Open': 'open'
    };
    return statusMap[status] || 'default';
  }

  getPriorityClass(priority: string): string {
    return priority.toLowerCase();
  }
}
