import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { Chart, ChartConfiguration, registerables } from 'chart.js';

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
  imports: [CommonModule, FormsModule, SidebarComponent],
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.scss']
})
export class PaymentsComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('earningsChart') earningsChartRef!: ElementRef<HTMLCanvasElement>;
  private chart?: Chart;
  private isBrowser: boolean;

  isSidebarOpen = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  // Account data
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

  // Billing details
  legalName = 'Marie Dubois';
  address = '123 Rue de la Paix 75001 Paris, France';
  siret = '12345678901234';
  vatNumber = 'FR12345678901';
  invoiceEmail = 'marie.dubois@email.com';

  // Payment method
  cardLast4 = '4242';
  cardExpiry = '12/24';
  cardExpired = true;

  // Invoices
  selectedYear = 2024;
  selectedStatus = 'All Status';
  invoices: Invoice[] = [
    { date: 'Dec 15, 2024', invoiceNumber: '#INV-2024-12-001', amount: '49.00', status: 'unpaid' },
    { date: 'Nov 15, 2024', invoiceNumber: '#INV-2024-11-001', amount: '49.00', status: 'paid' }
  ];

  // Payouts
  bankName = 'BNP Paribas';
  bankAccount = '••••••••••1234';
  payoutSchedule = 'Weekly payouts';
  payoutFrequency = 'Every Friday when balance ≥ €50';
  nextPayoutDate = 'Dec 20, 2024';
  nextPayoutAmount = 1247.50;

  payouts: Payout[] = [
    { date: 'Dec 13, 2024', payoutId: 'po_1234567890', amount: '985.20', status: 'paid', destination: 'BNP Paribas ••••1234' },
    { date: 'Dec 6, 2024', payoutId: 'po_0987654321', amount: '742.80', status: 'paid', destination: 'BNP Paribas ••••1234' }
  ];

  // Chart data (simplified for demo)
  chartMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // Earnings data for the chart
  grossEarningsData = [450, 650, 700, 820, 750, 900, 1050, 1150, 1350, 1150, 950, 1150, 1250];
  netEarningsData = [380, 550, 620, 700, 650, 800, 950, 1000, 1150, 1000, 850, 950, 1050];

  ngOnInit() {
    // Component initialization
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

  updateCard() {
    console.log('Update card clicked');
  }

  retryPayment() {
    console.log('Retry payment clicked');
  }

  upgradePlan() {
    console.log('Upgrade plan clicked');
  }

  downgradePlan() {
    console.log('Downgrade plan clicked');
  }

  pausePlan() {
    console.log('Pause plan clicked');
  }

  cancelPlan() {
    console.log('Cancel plan clicked');
  }

  completeTaxInfo() {
    console.log('Complete tax info clicked');
  }

  editBillingDetails() {
    console.log('Edit billing details clicked');
  }

  addCard() {
    console.log('Add card clicked');
  }

  updateBankInfo() {
    console.log('Update bank info clicked');
  }

  viewInvoice(invoice: Invoice) {
    console.log('View invoice:', invoice);
  }

  downloadInvoice(invoice: Invoice) {
    console.log('Download invoice:', invoice);
  }
}
