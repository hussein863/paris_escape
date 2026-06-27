import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

interface CalendarDay {
  date: Date;
  dateStr: string;    // YYYY-MM-DD
  dayNum: number;
  inMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  isDisabled: boolean;
}

@Component({
  selector: 'app-calendar-picker',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calendar-picker.component.html',
  styleUrl: './calendar-picker.component.scss'
})
export class CalendarPickerComponent implements OnChanges {
  @Input() selectedDate = '';
  @Input() recurringPattern = 'daily';   // 'daily' | 'weekends' | 'custom'
  @Input() blockedRanges: { start: string; end: string }[] = [];
  @Output() dateSelected = new EventEmitter<string>();

  readonly WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  readonly MONTHS = [
    'January','February','March','April','May','June',
    'July','August','September','October','November','December'
  ];

  today = new Date();
  viewYear = this.today.getFullYear();
  viewMonth = this.today.getMonth();
  weeks: CalendarDay[][] = [];

  ngOnChanges(changes: SimpleChanges): void {
    this.buildCalendar();
  }

  get monthLabel(): string {
    return `${this.MONTHS[this.viewMonth]} ${this.viewYear}`;
  }

  prevMonth(): void {
    if (this.viewMonth === 0) { this.viewMonth = 11; this.viewYear--; }
    else this.viewMonth--;
    this.buildCalendar();
  }

  nextMonth(): void {
    if (this.viewMonth === 11) { this.viewMonth = 0; this.viewYear++; }
    else this.viewMonth++;
    this.buildCalendar();
  }

  private buildCalendar(): void {
    const todayStr = this.toDateStr(this.today);
    const firstDay = new Date(this.viewYear, this.viewMonth, 1);
    // Monday-start grid: getDay() returns 0=Sun so shift
    let startOffset = (firstDay.getDay() + 6) % 7; // Mon=0 … Sun=6
    const totalDays = new Date(this.viewYear, this.viewMonth + 1, 0).getDate();

    const days: CalendarDay[] = [];

    // Padding before
    for (let i = startOffset - 1; i >= 0; i--) {
      const d = new Date(this.viewYear, this.viewMonth, -i);
      days.push(this.makeDay(d, false, todayStr));
    }
    // Current month
    for (let d = 1; d <= totalDays; d++) {
      const date = new Date(this.viewYear, this.viewMonth, d);
      days.push(this.makeDay(date, true, todayStr));
    }
    // Padding after
    const remaining = (7 - (days.length % 7)) % 7;
    for (let d = 1; d <= remaining; d++) {
      const date = new Date(this.viewYear, this.viewMonth + 1, d);
      days.push(this.makeDay(date, false, todayStr));
    }

    // Chunk into weeks
    this.weeks = [];
    for (let i = 0; i < days.length; i += 7) {
      this.weeks.push(days.slice(i, i + 7));
    }
  }

  private makeDay(date: Date, inMonth: boolean, todayStr: string): CalendarDay {
    const dateStr = this.toDateStr(date);
    return {
      date,
      dateStr,
      dayNum: date.getDate(),
      inMonth,
      isToday: dateStr === todayStr,
      isSelected: dateStr === this.selectedDate,
      isDisabled: this.isDayDisabled(date, dateStr, todayStr),
    };
  }

  private isDayDisabled(date: Date, dateStr: string, todayStr: string): boolean {
    // Past dates
    if (dateStr < todayStr) return true;
    // Recurring pattern
    if (this.recurringPattern === 'weekends') {
      const dow = date.getDay(); // 0=Sun, 6=Sat
      if (dow !== 0 && dow !== 6) return true;
    }
    // Blocked ranges
    for (const range of this.blockedRanges) {
      if (dateStr >= range.start && dateStr <= range.end) return true;
    }
    return false;
  }

  selectDay(day: CalendarDay): void {
    if (day.isDisabled || !day.inMonth) return;
    this.dateSelected.emit(day.dateStr);
  }

  private toDateStr(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }
}
