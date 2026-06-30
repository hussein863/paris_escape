import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { AdminHeaderComponent } from '../header/admin-header.component';
import { BookingService } from '../../core/services/booking.service';
import { Booking } from '../../core/models';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-reservations',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent, AdminHeaderComponent],
  templateUrl: './reservations.component.html',
  styleUrl: './reservations.component.scss'
})
export class ReservationsComponent implements OnInit {
  currentDate = new Date();
  selectedView = 'list';
  selectedStatus = 'all';
  searchQuery = '';
  isSidebarOpen = false;
  allBookings: Booking[] = [];
  blockedDays: any[] = [];
  loading = false;
  actionInProgress = false;

  // Detail panel
  detailPanelOpen = false;
  detailLoading = false;
  detailBooking: Booking | null = null;

  // Toast
  toast: { message: string; type: 'success' | 'error' } | null = null;
  private toastTimer: any;

  // Modals
  showBlockDaysModal = false;
  showAddBookingModal = false;
  blockDaysForm = { startDate: '', endDate: '', reason: '' };
  addBookingForm = { guestName: '', date: '', time: '', guests: 1 };
  feedbackMessage = '';
  feedbackType: 'success' | 'error' = 'success';

  constructor(
    private bookingService: BookingService,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadBookings();
  }

  @HostListener('document:keydown.escape')
  onEsc(): void {
    if (this.detailPanelOpen) this.closeDetailPanel();
    if (this.showBlockDaysModal) this.closeBlockDaysModal();
    if (this.showAddBookingModal) this.closeAddBookingModal();
  }

  loadBookings(): void {
    this.loading = true;
    this.bookingService.list().subscribe({
      next: (res: any) => {
        this.allBookings = res.results || [];
        this.loading = false;
        if (this.allBookings.length > 0) {
          const expId = this.allBookings[0].experience;
          this.bookingService.getBlockedDays(expId).subscribe({
            next: (r: any) => { this.blockedDays = r.results || []; },
            error: () => {}
          });
        }
      },
      error: () => { this.loading = false; }
    });
  }

  // ── Stats ──────────────────────────────────────────────────────────────────

  get pendingCount(): number { return this.allBookings.filter(b => b.status === 'Pending').length; }
  get confirmedCount(): number { return this.allBookings.filter(b => b.status === 'Confirmed').length; }
  get cancelledCount(): number { return this.allBookings.filter(b => b.status === 'Cancelled').length; }
  get disputedCount(): number { return this.allBookings.filter(b => b.status === 'Disputed').length; }

  get upcomingCount(): number {
    const today = new Date().toISOString().split('T')[0];
    return this.allBookings.filter(b => b.status === 'Confirmed' && b.date >= today).length;
  }

  get totalRevenue(): number {
    return this.allBookings
      .filter(b => b.status === 'Confirmed')
      .reduce((sum, b) => sum + Number(b.total_amount || 0), 0);
  }

  // ── Filters ────────────────────────────────────────────────────────────────

  get filteredBookings(): Booking[] {
    return this.allBookings.filter(b => {
      const matchesStatus = this.selectedStatus === 'all' || b.status === this.selectedStatus;
      const q = this.searchQuery.toLowerCase();
      const matchesSearch = !q ||
        (b.customer_name ?? '').toLowerCase().includes(q) ||
        (b.experience_title ?? '').toLowerCase().includes(q) ||
        (b.booking_ref ?? '').toLowerCase().includes(q);
      return matchesStatus && matchesSearch;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  // ── Detail Panel ──────────────────────────────────────────────────────────

  openDetailPanel(booking: Booking): void {
    this.detailBooking = booking;
    this.detailPanelOpen = true;
    this.detailLoading = true;
    this.bookingService.get(booking.id).subscribe({
      next: (full) => {
        this.detailBooking = {
          ...full,
          experience_title: full.experience_title || booking.experience_title,
          customer_name: full.customer_name || booking.customer_name,
        };
        this.detailLoading = false;
      },
      error: () => { this.detailLoading = false; }
    });
  }

  closeDetailPanel(): void {
    this.detailPanelOpen = false;
    setTimeout(() => { this.detailBooking = null; }, 300);
  }

  // ── Actions ───────────────────────────────────────────────────────────────

  confirmBooking(booking: Booking): void {
    this.actionInProgress = true;
    this.bookingService.update(booking.id, { status: 'Confirmed' }).subscribe({
      next: (updated) => {
        this.allBookings = this.allBookings.map(b =>
          b.id === booking.id ? { ...b, status: updated.status } : b
        );
        if (this.detailBooking?.id === booking.id) {
          this.detailBooking = { ...this.detailBooking, status: updated.status };
        }
        this.showToast('Booking confirmed');
        this.actionInProgress = false;
      },
      error: () => {
        this.showToast('Failed to confirm booking', 'error');
        this.actionInProgress = false;
      }
    });
  }

  cancelBooking(booking: Booking): void {
    if (!confirm(`Cancel this booking for ${new Date(booking.date).toLocaleDateString()}?`)) return;
    this.actionInProgress = true;
    this.bookingService.update(booking.id, { status: 'Cancelled' }).subscribe({
      next: (updated) => {
        this.allBookings = this.allBookings.map(b =>
          b.id === booking.id ? { ...b, status: updated.status } : b
        );
        if (this.detailBooking?.id === booking.id) {
          this.detailBooking = { ...this.detailBooking, status: updated.status };
        }
        this.showToast('Booking cancelled');
        this.actionInProgress = false;
      },
      error: () => {
        this.showToast('Failed to cancel booking', 'error');
        this.actionInProgress = false;
      }
    });
  }

  messageCustomer(booking: Booking): void {
    this.router.navigate(['/admin/messages'], { queryParams: { bookingId: booking.id } });
  }

  goToExperiences(): void {
    this.router.navigate(['/admin/experiences']);
  }

  // ── Toast ─────────────────────────────────────────────────────────────────

  showToast(message: string, type: 'success' | 'error' = 'success'): void {
    this.toast = { message, type };
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => { this.toast = null; }, 3500);
  }

  // ── Calendar ──────────────────────────────────────────────────────────────

  get currentMonth(): string {
    return this.currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }

  get calendarDays(): any[] {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const adjustedStart = (firstDay.getDay() + 6) % 7; // Monday-first
    const today = new Date();
    const days: any[] = [];

    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = adjustedStart - 1; i >= 0; i--) {
      days.push({ day: prevMonthLastDay - i, isCurrentMonth: false, bookings: [] });
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const d = new Date(year, month, day);
      const dayBookings = this.allBookings
        .filter(b => {
          const bd = new Date(b.date);
          return bd.getDate() === day && bd.getMonth() === month && bd.getFullYear() === year;
        })
        .map(b => ({
          id: b.id,
          time: b.time?.slice(0, 5) || '',
          status: b.status,
          name: b.customer_name || '',
          booking: b
        }));

      const isBlocked = this.blockedDays.some(bd => {
        const s = new Date(bd.start_date);
        const e = new Date(bd.end_date);
        return d >= s && d <= e;
      });

      days.push({
        day,
        isCurrentMonth: true,
        isToday: day === today.getDate() && month === today.getMonth() && year === today.getFullYear(),
        isBlocked,
        bookings: dayBookings
      });
    }

    const remaining = 42 - days.length;
    for (let day = 1; day <= remaining; day++) {
      days.push({ day, isCurrentMonth: false, bookings: [] });
    }

    return days;
  }

  previousMonth(): void {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1);
  }

  nextMonth(): void {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1);
  }

  // ── Helpers ───────────────────────────────────────────────────────────────

  getStatusIcon(status: string): string {
    const map: Record<string, string> = {
      Confirmed: 'fa-check-circle',
      Pending: 'fa-clock',
      Cancelled: 'fa-times-circle',
      Disputed: 'fa-exclamation-circle',
    };
    return map[status] ?? 'fa-circle';
  }

  getStepState(step: number, booking: Booking): 'done' | 'active' | 'idle' {
    if (booking.status === 'Cancelled' || booking.status === 'Disputed') return 'idle';
    const today = new Date().toISOString().split('T')[0];
    const isPast = booking.date < today;
    if (booking.status === 'Pending') return step === 1 ? 'active' : 'idle';
    if (step === 1) return 'done';
    if (step === 2) return isPast ? 'done' : 'active';
    if (step === 3) return isPast ? 'active' : 'idle';
    return 'idle';
  }

  initials(name: string | undefined): string {
    if (!name) return '?';
    const parts = name.trim().split(' ');
    return (parts[0][0] + (parts[1]?.[0] ?? '')).toUpperCase();
  }

  // ── Sidebar ───────────────────────────────────────────────────────────────

  toggleSidebar(): void { this.isSidebarOpen = !this.isSidebarOpen; }
  closeSidebar(): void { this.isSidebarOpen = false; }
  setView(view: string): void { this.selectedView = view; }

  // ── Block Days Modal ──────────────────────────────────────────────────────

  openBlockDaysModal(): void {
    this.blockDaysForm = { startDate: '', endDate: '', reason: '' };
    this.feedbackMessage = '';
    this.showBlockDaysModal = true;
  }

  closeBlockDaysModal(): void {
    this.showBlockDaysModal = false;
    this.feedbackMessage = '';
  }

  submitBlockDays(): void {
    if (!this.blockDaysForm.startDate || !this.blockDaysForm.endDate) {
      this.feedbackMessage = 'Please enter both start and end dates';
      this.feedbackType = 'error';
      return;
    }
    const experienceId = this.allBookings[0]?.experience || 1;
    this.actionInProgress = true;
    this.bookingService.blockDays(
      experienceId,
      this.blockDaysForm.startDate,
      this.blockDaysForm.endDate,
      this.blockDaysForm.reason
    ).subscribe({
      next: () => {
        this.feedbackMessage = `Days blocked from ${this.blockDaysForm.startDate} to ${this.blockDaysForm.endDate}`;
        this.feedbackType = 'success';
        setTimeout(() => { this.closeBlockDaysModal(); this.loadBookings(); }, 1500);
        this.actionInProgress = false;
      },
      error: (err: any) => {
        this.feedbackMessage = 'Failed: ' + (err.error?.detail || 'Unknown error');
        this.feedbackType = 'error';
        this.actionInProgress = false;
      }
    });
  }

  // ── Add Booking Modal ─────────────────────────────────────────────────────

  openAddBookingModal(): void {
    this.addBookingForm = { guestName: '', date: '', time: '', guests: 1 };
    this.feedbackMessage = '';
    this.showAddBookingModal = true;
  }

  closeAddBookingModal(): void {
    this.showAddBookingModal = false;
    this.feedbackMessage = '';
  }

  submitAddBooking(): void {
    if (!this.addBookingForm.guestName || !this.addBookingForm.date || !this.addBookingForm.time) {
      this.feedbackMessage = 'Please fill in all required fields';
      this.feedbackType = 'error';
      return;
    }
    const experienceId = this.allBookings[0]?.experience || 1;
    this.actionInProgress = true;
    this.http.post(`${environment.apiUrl}/bookings/create_manual/`, {
      experience_id: experienceId,
      date: this.addBookingForm.date,
      time: this.addBookingForm.time,
      adults: this.addBookingForm.guests || 1,
      children: 0,
      customer_name: this.addBookingForm.guestName,
    }).subscribe({
      next: () => {
        this.feedbackMessage = `Booking added for ${this.addBookingForm.guestName}`;
        this.feedbackType = 'success';
        setTimeout(() => { this.closeAddBookingModal(); this.loadBookings(); }, 1500);
        this.actionInProgress = false;
      },
      error: (err: any) => {
        this.feedbackMessage = 'Failed: ' + (err.error?.detail || JSON.stringify(err.error) || 'Unknown error');
        this.feedbackType = 'error';
        this.actionInProgress = false;
      }
    });
  }

  // ── Export ────────────────────────────────────────────────────────────────

  exportCSV(): void {
    if (!this.allBookings.length) { this.showToast('No bookings to export', 'error'); return; }
    const headers = ['Ref', 'Guest', 'Experience', 'Date', 'Time', 'Adults', 'Children', 'Status', 'Amount'];
    const rows = this.allBookings.map(b => [
      b.booking_ref, b.customer_name || '', b.experience_title || '',
      b.date, b.time || '', b.adults || 0, b.children || 0, b.status, b.total_amount
    ]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const url = window.URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `reservations-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  connectCalendar(): void {
    alert('Google Calendar integration coming soon!');
  }
}
