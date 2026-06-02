import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-reservations',
  standalone: true,
  imports: [CommonModule, SidebarComponent],
  templateUrl: './reservations.component.html',
  styleUrl: './reservations.component.scss'
})
export class ReservationsComponent {
  currentDate = new Date(2024, 11, 1); // December 2024
  selectedView = 'calendar';
  selectedExperience = 'all';
  isSidebarOpen = false;

  // Sample booking data
  bookings = [
    { date: 3, time: '10:00', status: 'confirmed' },
    { date: 5, time: '14:00', status: 'pending' },
    { date: 7, time: '11:00', status: 'confirmed' },
    { date: 10, time: '15:00', status: 'cancelled' },
    { date: 14, time: '09:30', status: 'confirmed' },
    { date: 21, time: '16:00', status: 'confirmed' }
  ];

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

    const days: any[] = [];

    // Previous month days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({
        day: prevMonthLastDay - i,
        isCurrentMonth: false,
        bookings: []
      });
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const dayBookings = this.bookings.filter(b => b.date === day);
      days.push({
        day,
        isCurrentMonth: true,
        isToday: day === 12,
        bookings: dayBookings
      });
    }

    // Next month days
    const remainingDays = 42 - days.length; // 6 weeks * 7 days
    for (let day = 1; day <= remainingDays; day++) {
      days.push({
        day,
        isCurrentMonth: false,
        bookings: []
      });
    }

    return days;
  }

  previousMonth(): void {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1);
  }

  nextMonth(): void {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1);
  }

  setView(view: string): void {
    this.selectedView = view;
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidebar(): void {
    this.isSidebarOpen = false;
  }
}
