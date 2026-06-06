import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { AdminHeaderComponent } from '../header/admin-header.component';
import { BookingService } from '../../core/services/booking.service';
import { Booking } from '../../core/models';

@Component({
  selector: 'app-reservations',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent, AdminHeaderComponent],
  templateUrl: './reservations.component.html',
  styleUrl: './reservations.component.scss'
})
export class ReservationsComponent implements OnInit {
  currentDate = new Date();
  selectedView = 'calendar';
  selectedExperience = 'all';
  selectedStatus = 'all';
  searchQuery = '';
  isSidebarOpen = false;
  allBookings: Booking[] = [];
  loading = false;
  actionInProgress = false;

  constructor(private bookingService: BookingService) {}

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings(): void {
    this.loading = true;
    this.bookingService.list().subscribe({
      next: (res) => {
        this.allBookings = res.results;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  confirmBooking(booking: Booking): void {
    this.actionInProgress = true;
    this.bookingService.update(booking.id, { status: 'Confirmed' }).subscribe({
      next: (updated) => {
        booking.status = updated.status;
        this.actionInProgress = false;
      },
      error: () => {
        alert('Failed to confirm booking');
        this.actionInProgress = false;
      }
    });
  }

  disputeBooking(booking: Booking): void {
    this.actionInProgress = true;
    this.bookingService.update(booking.id, { status: 'Disputed' }).subscribe({
      next: (updated) => {
        booking.status = updated.status;
        this.actionInProgress = false;
      },
      error: () => {
        alert('Failed to dispute booking');
        this.actionInProgress = false;
      }
    });
  }

  cancelBooking(booking: Booking): void {
    if (!confirm(`Cancel booking for ${new Date(booking.date).toLocaleDateString()}?`)) return;
    this.actionInProgress = true;
    this.bookingService.update(booking.id, { status: 'Cancelled' }).subscribe({
      next: (updated) => {
        booking.status = updated.status;
        this.actionInProgress = false;
      },
      error: () => {
        alert('Failed to cancel booking');
        this.actionInProgress = false;
      }
    });
  }

  // Map API bookings to calendar-friendly format
  get bookings(): { date: number; time: string; status: string }[] {
    return this.allBookings
      .filter(b => {
        const d = new Date(b.date);
        return d.getFullYear() === this.currentDate.getFullYear() &&
               d.getMonth() === this.currentDate.getMonth();
      })
      .map(b => ({
        date: new Date(b.date).getDate(),
        time: b.time?.slice(0, 5) ?? '',
        status: b.status.toLowerCase()
      }));
  }

  get currentMonth(): string {
    return this.currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }

  get calendarDays(): any[] {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    const today = new Date();
    const days: any[] = [];

    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({ day: prevMonthLastDay - i, isCurrentMonth: false, bookings: [] });
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dayBookings = this.bookings.filter(b => b.date === day);
      days.push({
        day,
        isCurrentMonth: true,
        isToday: day === today.getDate() && month === today.getMonth() && year === today.getFullYear(),
        bookings: dayBookings
      });
    }

    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      days.push({ day, isCurrentMonth: false, bookings: [] });
    }

    return days;
  }

  previousMonth(): void {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1);
    this.loadBookings();
  }

  nextMonth(): void {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1);
    this.loadBookings();
  }

  get filteredBookings(): Booking[] {
    return this.allBookings.filter(b => {
      const matchesStatus = this.selectedStatus === 'all' || b.status === this.selectedStatus;
      const matchesSearch = !this.searchQuery ||
        (b.customer_name ?? '').toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        (b.experience_title ?? '').toLowerCase().includes(this.searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  get pendingCount(): number { return this.allBookings.filter(b => b.status === 'Pending').length; }
  get confirmedCount(): number { return this.allBookings.filter(b => b.status === 'Confirmed').length; }

  setView(view: string): void { this.selectedView = view; }
  toggleSidebar(): void { this.isSidebarOpen = !this.isSidebarOpen; }
  closeSidebar(): void { this.isSidebarOpen = false; }
}
