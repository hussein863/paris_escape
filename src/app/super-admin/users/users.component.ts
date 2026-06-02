import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'Customer' | 'Guide' | 'Business' | 'Admin';
  status: 'Active' | 'Suspended' | 'KYC Pending';
  registrationDate: string;
  avatar: string;
}

interface UserTransaction {
  id: string;
  type: string;
  amount: string;
  date: string;
  status: string;
}

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent {
  users: User[] = [
    { id: '001', name: 'Marie Dubois', email: 'marie.d@paris.com', role: 'Guide', status: 'Active', registrationDate: '2024-01-15', avatar: 'MD' },
    { id: '002', name: 'Jean Martin', email: 'jean.m@paris.com', role: 'Customer', status: 'Active', registrationDate: '2024-02-20', avatar: 'JM' },
    { id: '003', name: 'Sophie Laurent', email: 'sophie.l@paris.com', role: 'Guide', status: 'KYC Pending', registrationDate: '2024-03-10', avatar: 'SL' },
    { id: '004', name: 'Pierre Blanc', email: 'pierre.b@paris.com', role: 'Customer', status: 'Suspended', registrationDate: '2023-11-05', avatar: 'PB' },
    { id: '005', name: 'Emma Rousseau', email: 'emma.r@paris.com', role: 'Business', status: 'Active', registrationDate: '2024-01-28', avatar: 'ER' }
  ];

  filteredUsers: User[] = [...this.users];
  selectedUser: User | null = null;
  isPanelOpen = false;

  filterRole = '';
  filterStatus = '';
  filterKYC = '';
  searchQuery = '';

  userTransactions: UserTransaction[] = [
    { id: 'TXN001', type: 'Booking Payment', amount: '€120', date: '2024-01-15', status: 'Completed' },
    { id: 'TXN002', type: 'Commission', amount: '€24', date: '2024-01-16', status: 'Completed' },
    { id: 'TXN003', type: 'Refund', amount: '-€50', date: '2024-01-20', status: 'Processed' }
  ];

  notes: string = '';

  applyFilters(): void {
    this.filteredUsers = this.users.filter(user => {
      const matchesRole = !this.filterRole || user.role === this.filterRole;
      const matchesStatus = !this.filterStatus || user.status === this.filterStatus;
      const matchesSearch = !this.searchQuery ||
        user.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(this.searchQuery.toLowerCase());
      return matchesRole && matchesStatus && matchesSearch;
    });
  }

  viewUser(user: User): void {
    this.selectedUser = user;
    this.isPanelOpen = true;
  }

  closePanel(): void {
    this.isPanelOpen = false;
    this.selectedUser = null;
  }

  suspendUser(): void {
    if (this.selectedUser) {
      this.selectedUser.status = this.selectedUser.status === 'Suspended' ? 'Active' : 'Suspended';
    }
  }

  exportCSV(): void {
    alert('Exporting users to CSV...');
  }

  addAdmin(): void {
    alert('Add new admin dialog...');
  }
}
