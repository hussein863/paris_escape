import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../sidebar/sidebar.component';

interface VerificationCard {
  title: string;
  status: 'verified' | 'in-review' | 'not-started';
  statusText: string;
}

interface AuditLogEntry {
  title: string;
  description: string;
  timestamp: string;
  status: 'success' | 'pending' | 'info';
}

@Component({
  selector: 'app-kyc',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent],
  templateUrl: './kyc.component.html',
  styleUrl: './kyc.component.scss'
})
export class KycComponent {
  isSidebarOpen = false;
  personType: 'individual' | 'company' = 'individual';
  isMicroEnterprise = true;
  pepScreening = false;
  dataProtection = true;
  accuracyConfirmation = true;

  verificationCards: VerificationCard[] = [
    { title: 'Identity', status: 'verified', statusText: 'Documents verified' },
    { title: 'Address', status: 'verified', statusText: 'Proof approved' },
    { title: 'Business & Tax', status: 'in-review', statusText: 'In review' },
    { title: 'Bank Account', status: 'not-started', statusText: 'Not started' }
  ];

  auditLog: AuditLogEntry[] = [
    {
      title: 'Address verification approved',
      description: 'Reviewed by compliance team',
      timestamp: 'Nov 29, 2024 14:32',
      status: 'success'
    },
    {
      title: 'Identity verification approved',
      description: 'All documents validated',
      timestamp: 'Nov 28, 2024 16:45',
      status: 'success'
    },
    {
      title: 'Business information submitted',
      description: 'Awaiting review',
      timestamp: 'Nov 30, 2024 09:15',
      status: 'pending'
    },
    {
      title: 'Address documents uploaded',
      description: 'IP: 192.168.1.1',
      timestamp: 'Nov 28, 2024 10:20',
      status: 'info'
    },
    {
      title: 'Verification process started',
      description: 'Account created',
      timestamp: 'Nov 27, 2024 18:30',
      status: 'info'
    }
  ];

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidebar(): void {
    this.isSidebarOpen = false;
  }

  setPersonType(type: 'individual' | 'company'): void {
    this.personType = type;
  }

  checkVAT(): void {
    console.log('Checking VAT...');
  }

  downloadPDF(): void {
    console.log('Downloading PDF...');
  }

  saveBankAccount(): void {
    console.log('Saving bank account...');
  }

  downloadData(): void {
    console.log('Downloading data...');
  }

  continueVerification(): void {
    console.log('Continue verification...');
  }
}
