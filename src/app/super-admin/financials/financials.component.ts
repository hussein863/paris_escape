import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-sa-financials',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './financials.component.html',
  styleUrl: './financials.component.scss'
})
export class SaFinancialsComponent {
  activeTab: 'payments' | 'payouts' = 'payments';
  payments: any[] = [];
  payouts: any[] = [];
  loading = true;

  stats = { totalRevenue: 0, totalCommission: 0, pendingPayouts: 0, paidPayouts: 0 };

  constructor(private http: HttpClient) { this.load(); }

  load(): void {
    this.loading = true;
    this.http.get<any>(`${environment.apiUrl}/superadmin/financials/`).subscribe({
      next: (res) => {
        this.payments = res.payments ?? [];
        this.payouts = res.payouts ?? [];
        this.stats = res.stats ?? this.stats;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }
}
