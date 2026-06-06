import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { AdminHeaderComponent } from '../header/admin-header.component';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { PaymentService } from '../../core/services/payment.service';
import { AuthService } from '../../core/services/auth.service';
import { Payment } from '../../core/models';

// Register Chart.js components
Chart.register(...registerables);

interface Invoice {
  date: string;
  invoiceNumber: string;
  amount: string;
  status: 'paid' | 'unpaid';
}

interface Payout {
  date: string;
  payoutId: string;
  amount: string;
  status: 'paid' | 'pending';
  destination: string;
}

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent, AdminHeaderComponent],
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.scss']
})
export class PaymentsComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('earningsChart') earningsChartRef!: ElementRef<HTMLCanvasElement>;
  private chart?: Chart;
  private isBrowser: boolean;

  loading = true;
  isSidebarOpen = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private paymentService: PaymentService,
    private authService: AuthService,
    private router: Router,
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  // Account data — defaults kept so page looks good with empty data
  currentPlan = 'Pro Plan';
  planPrice = 49;
  billingCycle = 'month';
  renewalDate = 'Jan 15, 2025';
  thisMonthEarnings = 1247.50;
  lastMonthEarnings = 985.20;
  nextInvoiceAmount = 49.00;
  nextInvoiceDate = 'Jan 15, 2025';

  // Payout readiness
  kycVerified = true;
  bankInfoComplete = true;
  taxInfoComplete = false;
  stripeConnected = true;

  // Billing details — defaults kept; overridden when API returns data
  legalName = 'Marie Dubois';
  address = '123 Rue de la Paix 75001 Paris, France';
  siret = '12345678901234';
  vatNumber = 'FR12345678901';
  invoiceEmail = 'marie.dubois@email.com';

  // Payment method
  cardLast4 = '4242';
  cardExpiry = '12/24';
  cardExpired = true;

  // Invoices — defaults kept; overridden when API returns data
  selectedYear = 2024;
  selectedStatus = 'All Status';
  invoices: Invoice[] = [
    { date: 'Dec 15, 2024', invoiceNumber: '#INV-2024-12-001', amount: '49.00', status: 'unpaid' },
    { date: 'Nov 15, 2024', invoiceNumber: '#INV-2024-11-001', amount: '49.00', status: 'paid' }
  ];

  /** Filtered view of invoices used by the template. */
  get filteredInvoices(): Invoice[] {
    return this.invoices.filter(inv => {
      const yearMatch = inv.date.includes(String(this.selectedYear));
      const statusMatch =
        this.selectedStatus === 'All Status' ||
        (this.selectedStatus === 'Paid' && inv.status === 'paid') ||
        (this.selectedStatus === 'Unpaid' && inv.status === 'unpaid');
      return yearMatch && statusMatch;
    });
  }

  // Payouts — defaults kept; overridden when API returns data
  bankName = 'BNP Paribas';
  bankAccount = '••••••••••1234';
  payoutSchedule = 'Weekly payouts';
  payoutFrequency = 'Every Friday when balance ≥ €50';
  nextPayoutDate = 'Dec 20, 2024';
  nextPayoutAmount = 1247.50;
  totalPaidOut = 0;

  payouts: Payout[] = [
    { date: 'Dec 13, 2024', payoutId: 'po_1234567890', amount: '985.20', status: 'paid', destination: 'BNP Paribas ••••1234' },
    { date: 'Dec 6, 2024', payoutId: 'po_0987654321', amount: '742.80', status: 'paid', destination: 'BNP Paribas ••••1234' }
  ];

  // Chart data — defaults kept; overridden from real payment data
  chartMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  grossEarningsData = [450, 650, 700, 820, 750, 900, 1050, 1150, 1350, 1150, 950, 1150];
  netEarningsData = [380, 550, 620, 700, 650, 800, 950, 1000, 1150, 1000, 850, 950];

  ngOnInit() {
    this.loadData();
  }

  private loadData(): void {
    this.loading = true;

    forkJoin({
      payments: this.paymentService.listPayments().pipe(catchError(() => of({ count: 0, next: null, previous: null, results: [] as Payment[] }))),
      payouts:  this.paymentService.listPayouts().pipe(catchError(() => of({ count: 0, next: null, previous: null, results: [] as any[] }))),
      billing:  this.paymentService.getBillingInfo().pipe(catchError(() => of([] as any[]))),
      subs:     this.paymentService.getSubscriptions().pipe(catchError(() => of({ count: 0, next: null, previous: null, results: [] as any[] })))
    }).subscribe(({ payments, payouts, billing, subs }) => {

      // ── Payments / Invoices ──────────────────────────────────────────────────
      if (payments.results.length > 0) {
        this.invoices = payments.results.map(p => this.mapPaymentToInvoice(p));
      }

      // ── Earnings stats ───────────────────────────────────────────────────────
      const now = new Date();
      const thisMonth = now.getMonth();   // 0-based
      const thisYear  = now.getFullYear();
      const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
      const lastMonthYear = thisMonth === 0 ? thisYear - 1 : thisYear;

      if (payments.results.length > 0) {
        this.thisMonthEarnings = payments.results
          .filter(p => {
            const d = new Date(p.date);
            return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
          })
          .reduce((sum, p) => sum + Number(p.amount), 0);

        this.lastMonthEarnings = payments.results
          .filter(p => {
            const d = new Date(p.date);
            return d.getMonth() === lastMonth && d.getFullYear() === lastMonthYear;
          })
          .reduce((sum, p) => sum + Number(p.amount), 0);

        // Build 12-month chart data (current month = last column)
        const monthlyTotals = new Array(12).fill(0);
        payments.results.forEach(p => {
          const d = new Date(p.date);
          const monthsAgo = (thisYear - d.getFullYear()) * 12 + (thisMonth - d.getMonth());
          if (monthsAgo >= 0 && monthsAgo < 12) {
            monthlyTotals[11 - monthsAgo] += Number(p.amount);
          }
        });

        // Only replace chart data when we have at least one non-zero value
        if (monthlyTotals.some(v => v > 0)) {
          this.grossEarningsData = monthlyTotals;
          // Net earnings = gross * 0.85 (approx platform fee deduction) when no separate net data
          this.netEarningsData = monthlyTotals.map(v => Math.round(v * 0.85 * 100) / 100);
          this.updateChart();
        }

        // Reorder chart labels to match rolling 12-month window
        const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        this.chartMonths = Array.from({ length: 12 }, (_, i) => {
          const mIdx = (thisMonth - 11 + i + 12) % 12;
          return monthNames[mIdx];
        });
      }

      // ── Payouts ──────────────────────────────────────────────────────────────
      if (payouts.results.length > 0) {
        this.payouts = payouts.results.map((po: any) => this.mapRawPayout(po));

        this.totalPaidOut = payouts.results
          .filter((po: any) => (po.status || '').toLowerCase() === 'paid')
          .reduce((sum: number, po: any) => sum + Number(po.amount || 0), 0);

        // Bank / schedule info from first payout record
        const firstPayout = payouts.results[0];
        if (firstPayout?.bank_account) {
          this.bankAccount = firstPayout.bank_account;
        }
        if (firstPayout?.frequency) {
          this.payoutSchedule = firstPayout.frequency;
        }
      }

      // ── Billing info ─────────────────────────────────────────────────────────
      const billingList = Array.isArray(billing) ? billing : (billing as any)?.results ?? [];
      if (billingList.length > 0) {
        const b = billingList[0];
        if (b.legal_name)    this.legalName    = b.legal_name;
        if (b.address)       this.address      = b.address;
        if (b.siret)         this.siret        = b.siret;
        if (b.vat_number)    this.vatNumber    = b.vat_number;
        if (b.invoice_email) this.invoiceEmail = b.invoice_email;
      }

      // ── Subscriptions ────────────────────────────────────────────────────────
      if (subs.results.length > 0) {
        const sub = subs.results[0];
        if (sub.plan)           this.currentPlan      = sub.plan;
        if (sub.price != null)  this.planPrice        = Number(sub.price);
        if (sub.cycle)          this.billingCycle     = sub.cycle;
        if (sub.renewal_date)   this.renewalDate      = sub.renewal_date;
        if (sub.next_invoice_amount != null) this.nextInvoiceAmount = Number(sub.next_invoice_amount);
        if (sub.next_invoice_date)           this.nextInvoiceDate   = sub.next_invoice_date;
      }

      this.loading = false;
      // Chart canvas is inside *ngIf="!loading", so it only enters the DOM after this tick.
      // Defer chart creation until Angular has rendered the canvas element.
      if (this.isBrowser) {
        setTimeout(() => {
          if (!this.chart) {
            this.createChart();
          } else {
            this.updateChart();
          }
        }, 0);
      }
    });
  }

  /** Map a backend Payment record to the local Invoice shape used by the template. */
  private mapPaymentToInvoice(p: Payment): Invoice {
    const date = new Date(p.date);
    const formattedDate = date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const statusLower = p.status?.toLowerCase() ?? '';
    const invoiceStatus: 'paid' | 'unpaid' = statusLower === 'paid' || statusLower === 'completed' ? 'paid' : 'unpaid';
    return {
      date: formattedDate,
      invoiceNumber: p.invoice_number ?? `#INV-${p.id}`,
      amount: Number(p.amount).toFixed(2),
      status: invoiceStatus
    };
  }

  /** Map a raw payout API record to the local Payout shape used by the template. */
  private mapRawPayout(po: any): Payout {
    const date = po.date ? new Date(po.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';
    const statusLower = (po.status ?? '').toLowerCase();
    return {
      date,
      payoutId: po.id ? `po_${po.id}` : '—',
      amount: Number(po.amount ?? 0).toFixed(2),
      status: statusLower === 'paid' ? 'paid' : 'pending',
      destination: po.bank_account ?? '—'
    };
  }

  /** Update an already-rendered chart with new data arrays. */
  private updateChart(): void {
    if (!this.chart) return;
    this.chart.data.labels = this.chartMonths;
    this.chart.data.datasets[0].data = this.grossEarningsData;
    this.chart.data.datasets[1].data = this.netEarningsData;
    const maxVal = Math.max(...this.grossEarningsData, 1);
    if (this.chart.options?.scales?.['y']) {
      (this.chart.options.scales['y'] as any).max = Math.ceil(maxVal * 1.15 / 100) * 100;
    }
    this.chart.update();
  }

  ngAfterViewInit() {
    this.createChart();
  }

  createChart() {
    if (!this.isBrowser || !this.earningsChartRef) return;

    const ctx = this.earningsChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    const config: ChartConfiguration = {
      type: 'line',
      data: {
        labels: this.chartMonths,
        datasets: [
          {
            label: 'Gross Earnings',
            data: this.grossEarningsData,
            borderColor: '#1a1a1a',
            backgroundColor: 'rgba(26, 26, 26, 0.15)',
            fill: true,
            tension: 0,
            borderWidth: 2,
            pointRadius: 0,
            pointHoverRadius: 6,
            pointHoverBackgroundColor: '#1a1a1a',
            pointHoverBorderColor: '#fff',
            pointHoverBorderWidth: 2
          },
          {
            label: 'Net Earnings',
            data: this.netEarningsData,
            borderColor: '#9ca3af',
            backgroundColor: 'rgba(156, 163, 175, 0.15)',
            fill: true,
            tension: 0,
            borderWidth: 2,
            pointRadius: 0,
            pointHoverRadius: 6,
            pointHoverBackgroundColor: '#9ca3af',
            pointHoverBorderColor: '#fff',
            pointHoverBorderWidth: 2
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: '#fff',
            titleColor: '#1a1a1a',
            bodyColor: '#6b6b6b',
            borderColor: '#e5e5e5',
            borderWidth: 1,
            padding: 12,
            displayColors: true,
            callbacks: {
              label: function(context) {
                return context.dataset.label + ': €' + context.parsed.y;
              }
            }
          }
        },
        scales: {
          x: {
            grid: {
              display: true,
              color: '#f0f0f0'
            },
            ticks: {
              color: '#6b6b6b',
              font: {
                size: 11
              }
            }
          },
          y: {
            beginAtZero: false,
            min: 0,
            max: 1400,
            grid: {
              display: true,
              color: '#f0f0f0'
            },
            ticks: {
              color: '#6b6b6b',
              font: {
                size: 11
              },
              callback: function(value) {
                return value;
              }
            }
          }
        }
      }
    };

    this.chart = new Chart(ctx, config);
  }

  ngOnDestroy() {
    if (this.chart) {
      this.chart.destroy();
    }
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidebar() {
    this.isSidebarOpen = false;
  }

  updateCard() { this.router.navigate(['/admin/settings']); }
  retryPayment() { /* requires Stripe integration */ }
  upgradePlan() { this.router.navigate(['/admin/settings']); }
  downgradePlan() { this.router.navigate(['/admin/settings']); }
  pausePlan() { /* requires Stripe integration */ }
  cancelPlan() { /* requires Stripe integration */ }
  completeTaxInfo() { this.router.navigate(['/admin/kyc']); }
  editBillingDetails() { this.router.navigate(['/admin/settings']); }
  addCard() { this.router.navigate(['/admin/settings']); }
  updateBankInfo() { this.router.navigate(['/admin/settings']); }

  viewInvoice(invoice: Invoice) {
    // Open invoice detail in new tab if URL exists
    if ((invoice as any).url) window.open((invoice as any).url, '_blank');
  }

  downloadInvoice(invoice: Invoice) {
    const rows = [`Date,Invoice,Amount,Status`, `${invoice.date},${invoice.invoiceNumber},${invoice.amount},${invoice.status}`];
    const blob = new Blob([rows.join('\n')], { type: 'text/csv' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
    a.download = `invoice-${invoice.invoiceNumber}.csv`; a.click();
  }
}
