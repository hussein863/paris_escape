import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface KPICard {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: string;
}

interface Alert {
  type: 'critical' | 'warning' | 'info';
  message: string;
  action: string;
}

interface Activity {
  icon: string;
  description: string;
  timestamp: string;
  link: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  searchQuery = '';

  kpis: KPICard[] = [
    { title: 'Total Revenue', value: '€124,590', change: '+12.5%', isPositive: true, icon: 'euro-sign' },
    { title: 'Total Bookings', value: '1,432', change: '+8.2%', isPositive: true, icon: 'calendar-check' },
    { title: 'Active Experiences', value: '89', change: '+5', isPositive: true, icon: 'star' },
    { title: 'New Users', value: '234', change: '-2.1%', isPositive: false, icon: 'user' }
  ];

  alerts: Alert[] = [
    { type: 'critical', message: '3 failed payments require attention', action: 'Review' },
    { type: 'warning', message: '12 KYC verifications pending', action: 'Review' },
    { type: 'warning', message: '5 open disputes awaiting response', action: 'Review' },
    { type: 'info', message: '8 experiences pending approval', action: 'Review' }
  ];

  quickActions = [
    { title: 'Users', icon: 'users', route: '/super-admin/users', count: '1,234' },
    { title: 'Experiences', icon: 'star', route: '/super-admin/business', count: '89' },
    { title: 'Bookings', icon: 'calendar-alt', route: '/super-admin/business', count: '432' },
    { title: 'Payments', icon: 'credit-card', route: '/super-admin/business', count: '567' },
    { title: 'Disputes', icon: 'exclamation-circle', route: '/super-admin/business', count: '5' },
    { title: 'Settings', icon: 'cog', route: '/super-admin/system', count: '' }
  ];

  recentActivities: Activity[] = [
    { icon: 'check-circle', description: 'Experience "Paris Night Tour" approved', timestamp: '2 min ago', link: '#' },
    { icon: 'user', description: 'New guide registered: Marie Dubois', timestamp: '15 min ago', link: '#' },
    { icon: 'dollar-sign', description: 'Payment of €250 processed', timestamp: '1 hour ago', link: '#' },
    { icon: 'file-alt', description: 'Booking #4532 confirmed', timestamp: '2 hours ago', link: '#' },
    { icon: 'star', description: 'New review posted (5 stars)', timestamp: '3 hours ago', link: '#' }
  ];

  chartFilter = '30d';
  chartFilters = ['7d', '30d', '90d'];

  ngOnInit(): void {
    // Initialize chart data
  }

  setChartFilter(filter: string): void {
    this.chartFilter = filter;
  }
}
