import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExperienceWizardService } from '../../../../core/services/experience-wizard.service';

interface TimeSlot {
  id: string;
  time: string;
  label: string;
}

@Component({
  selector: 'app-step-availability',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './step-availability.component.html',
  styleUrl: './step-availability.component.scss',
})
export class StepAvailabilityComponent {
  @Output() dataChange = new EventEmitter<any>();

  constructor(private wizardService: ExperienceWizardService) {}

  saveToApi(): Promise<void> {
    const id = this.wizardService.experienceId;
    if (!id) return Promise.resolve();

    const availData = {
      recurring_pattern: this.formData.recurringPattern,
      minimum_notice: this.formData.minimumNotice,
      same_day_cutoff: this.formData.sameDayCutoff || null,
      google_calendar_connected: this.formData.googleCalendarConnected,
      ical_connected: this.formData.iCalConnected,
    };

    return new Promise((resolve, reject) => {
      this.wizardService.saveAvailability(id, availData, this.timeSlots)
        .subscribe({ next: () => resolve(), error: reject });
    });
  }

  formData = {
    recurringPattern: 'weekends',
    timeSlots: [] as TimeSlot[],
    minimumNotice: '1-hour',
    sameDayCutoff: '08:00',
    googleCalendarConnected: false,
    iCalConnected: false
  };

  showAddTimeSlotModal = false;
  showAddBlackoutModal = false;
  editingSlot: TimeSlot | null = null;

  newTimeSlot = {
    time: '',
    label: ''
  };

  availabilityPatterns = [
    {
      id: 'daily',
      title: 'Daily',
      description: 'Available every day of the week'
    },
    {
      id: 'weekends',
      title: 'Weekends',
      description: 'Saturday and Sunday only'
    },
    {
      id: 'custom',
      title: 'Custom weekdays',
      description: 'Select specific days'
    }
  ];

  timeSlots: TimeSlot[] = [
    { id: 'slot1', time: '10:00 AM', label: 'Morning slot' },
    { id: 'slot2', time: '2:00 PM', label: 'Afternoon slot' }
  ];

  minimumNoticeOptions = [
    { value: '1-hour', label: '1 hour' },
    { value: '2-hours', label: '2 hours' },
    { value: '4-hours', label: '4 hours' },
    { value: '12-hours', label: '12 hours' },
    { value: '1-day', label: '1 day' },
    { value: '2-days', label: '2 days' },
    { value: '3-days', label: '3 days' },
    { value: '1-week', label: '1 week' }
  ];

  availabilityTips = [
    {
      icon: 'fa-calendar-check',
      color: 'green',
      title: 'Be flexible',
      description: 'Offer multiple time slots to increase booking chances.'
    },
    {
      icon: 'fa-clock',
      color: 'blue',
      title: 'Peak times',
      description: 'Weekends and mornings are most popular in Paris.'
    },
    {
      icon: 'fa-sync',
      color: 'purple',
      title: 'Stay synced',
      description: 'Connect your calendar to avoid double bookings.'
    }
  ];

  popularTimeSlots = [
    { time: '10:00 AM', status: 'Most popular' },
    { time: '2:00 PM', status: 'High demand' },
    { time: '4:00 PM', status: 'Good uptake' },
    { time: '6:00 PM', status: 'Evening option' }
  ];

  get setupProgress() {
    return {
      patternChosen: !!this.formData.recurringPattern,
      timeSlotsAdded: this.timeSlots.length > 0,
      bookingRulesSet: false,
      calendarConnected: this.formData.googleCalendarConnected || this.formData.iCalConnected
    };
  }

  selectPattern(patternId: string): void {
    this.formData.recurringPattern = patternId;
    this.emitData();
  }

  openAddTimeSlotModal(): void {
    this.showAddTimeSlotModal = true;
    this.editingSlot = null;
    this.newTimeSlot = {
      time: '',
      label: ''
    };
  }

  openEditTimeSlotModal(slot: TimeSlot): void {
    this.showAddTimeSlotModal = true;
    this.editingSlot = slot;
    this.newTimeSlot = {
      time: slot.time,
      label: slot.label
    };
  }

  closeTimeSlotModal(): void {
    this.showAddTimeSlotModal = false;
    this.editingSlot = null;
  }

  saveTimeSlot(): void {
    if (this.newTimeSlot.time && this.newTimeSlot.label) {
      if (this.editingSlot) {
        // Update existing slot
        this.editingSlot.time = this.newTimeSlot.time;
        this.editingSlot.label = this.newTimeSlot.label;
      } else {
        // Add new slot
        this.timeSlots.push({
          id: 'slot-' + Date.now(),
          time: this.newTimeSlot.time,
          label: this.newTimeSlot.label
        });
      }
      this.closeTimeSlotModal();
      this.emitData();
    }
  }

  deleteTimeSlot(slotId: string): void {
    this.timeSlots = this.timeSlots.filter(s => s.id !== slotId);
    this.emitData();
  }

  openAddBlackoutModal(): void {
    this.showAddBlackoutModal = true;
  }

  closeBlackoutModal(): void {
    this.showAddBlackoutModal = false;
  }

  connectGoogleCalendar(): void {
    // Placeholder for Google Calendar OAuth flow
    /* not implemented */
    this.formData.googleCalendarConnected = true;
    this.emitData();
  }

  connectICal(): void {
    // Placeholder for iCal connection
    /* not implemented */
    this.formData.iCalConnected = true;
    this.emitData();
  }

  onDataChange(): void {
    this.emitData();
  }

  emitData(): void {
    this.formData.timeSlots = this.timeSlots;
    this.dataChange.emit(this.formData);
  }
}

