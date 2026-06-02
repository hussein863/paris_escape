import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Guide } from '../guide-profile.component';

interface CalendarDay {
  day: number | null;
  isSelected: boolean;
  isDisabled: boolean;
}

@Component({
  selector: 'app-profile-sidebar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile-sidebar.component.html',
  styleUrl: './profile-sidebar.component.scss'
})
export class ProfileSidebarComponent implements OnInit {
  @Input() guide!: Guide;
  
  currentMonth = 'January 2026';
  weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  calendarDays: CalendarDay[] = [];
  selectedDate: number | null = 1;
  
  contactForm = {
    subject: '',
    message: '',
    preferredDate: ''
  };

  ngOnInit(): void {
    this.generateCalendar();
  }

  generateCalendar(): void {
    this.calendarDays = [
      // Previous month days (28-31) - disabled/grayed out
      { day: 28, isSelected: false, isDisabled: true },
      { day: 29, isSelected: false, isDisabled: true },
      { day: 30, isSelected: false, isDisabled: true },
      { day: 31, isSelected: false, isDisabled: true },
      // Current month - 1 is selected, 2-10 are enabled
      { day: 1, isSelected: true, isDisabled: false },
      { day: 2, isSelected: false, isDisabled: false },
      { day: 3, isSelected: false, isDisabled: false },
      { day: 4, isSelected: false, isDisabled: false },
      { day: 5, isSelected: false, isDisabled: false },
      { day: 6, isSelected: false, isDisabled: false },
      { day: 7, isSelected: false, isDisabled: false },
      { day: 8, isSelected: false, isDisabled: false },
      { day: 9, isSelected: false, isDisabled: false },
      { day: 10, isSelected: false, isDisabled: false },
    ];
  }

  selectDate(calendarDay: CalendarDay): void {
    if (calendarDay.day && !calendarDay.isDisabled) {
      this.selectedDate = calendarDay.day;
      this.calendarDays.forEach(d => d.isSelected = d.day === calendarDay.day);
    }
  }

  submitContact(): void {
    console.log('Contact form submitted:', this.contactForm);
  }
}
