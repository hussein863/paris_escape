import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Guide } from '../guide-profile.component';
import { MessagingService } from '../../../core/services/messaging.service';
import { AuthService } from '../../../core/services/auth.service';

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
  @Input() guideId: number | null = null;
  messageSending = false;
  
  currentMonth = 'January 2026';
  weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  calendarDays: CalendarDay[] = [];
  selectedDate: number | null = 1;
  
  contactForm = {
    subject: '',
    message: '',
    preferredDate: ''
  };

  constructor(
    private router: Router,
    private messagingService: MessagingService,
    private auth: AuthService,
  ) {}

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
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/auth/login']);
      return;
    }
    const id = this.guideId;
    if (!id) return;
    this.messageSending = true;
    this.messagingService.startConversation(id).subscribe({
      next: (conv) => {
        this.messageSending = false;
        this.router.navigate(['/client/messages'], { queryParams: { conversationId: conv.id } });
      },
      error: () => { this.messageSending = false; }
    });
  }
}
