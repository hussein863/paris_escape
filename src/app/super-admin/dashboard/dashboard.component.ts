import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  loading = true;
  stats: any = null;

  kpis: { title: string; value: string | number; sub: string; icon: string; color: string }[] = [];

  pendingActions: { label: string; count: number; route: string; urgent: boolean }[] = [];

  quickLinks = [
    { label: 'Users',        icon: 'users',          route: '/super-admin/users' },
    { label: 'KYC Queue',    icon: 'id-card',         route: '/super-admin/kyc' },
    { label: 'Experiences',  icon: 'map',             route: '/super-admin/experiences' },
    { label: 'Bookings',     icon: 'calendar-check',  route: '/super-admin/bookings' },
    { label: 'Reports',      icon: 'flag',            route: '/super-admin/reports' },
    { label: 'Financials',   icon: 'chart-line',      route: '/super-admin/financials' },
  ];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<any>(`${environment.apiUrl}/superadmin/stats/`).subscribe({
      next: (data) => {
        this.stats = data;
        this.buildKpis(data);
        this.buildPendingActions(data);
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  private buildKpis(d: any): void {
    this.kpis = [
      {
        title: 'Total Users',
        value: d.users.total,
        sub: `${d.users.guides} guides · ${d.users.travelers} travelers`,
        icon: 'users',
        color: '#6366f1',
      },
      {
        title: 'New Users This Month',
        value: d.users.new_this_month,
        sub: 'registered this month',
        icon: 'user-plus',
        color: '#10b981',
      },
      {
        title: 'Active Experiences',
        value: d.experiences.active,
        sub: `${d.experiences.pending_review} awaiting review`,
        icon: 'map',
        color: '#f59e0b',
      },
      {
        title: 'Bookings This Month',
        value: d.bookings.this_month,
        sub: `${d.bookings.total} total · ${d.bookings.disputed} disputed`,
        icon: 'calendar-check',
        color: '#3b82f6',
      },
      {
        title: 'Revenue This Month',
        value: '€' + Number(d.revenue_this_month).toLocaleString('fr-FR', { minimumFractionDigits: 0 }),
        sub: 'from confirmed bookings',
        icon: 'euro-sign',
        color: '#000000',
      },
    ];
  }

  private buildPendingActions(d: any): void {
    const pa = d.pending_actions;
    this.pendingActions = [
      { label: 'KYC verifications pending',      count: pa.kyc,         route: '/super-admin/kyc',         urgent: pa.kyc > 0 },
      { label: 'Experiences awaiting approval',  count: pa.experiences, route: '/super-admin/experiences',  urgent: pa.experiences > 0 },
      { label: 'Unreviewed reports',             count: pa.reports,     route: '/super-admin/reports',      urgent: pa.reports > 5 },
      { label: 'Open disputes',                  count: pa.disputes,    route: '/super-admin/bookings',     urgent: pa.disputes > 0 },
      { label: 'Open support tickets',           count: pa.tickets,     route: '/super-admin/support',      urgent: false },
    ].filter(a => a.count > 0);
  }
}
