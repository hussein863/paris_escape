import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Inclusion {
  text: string;
}

interface SocialLink {
  platform: string;
  username: string;
  icon: string;
  showOnProfile: boolean;
}

@Component({
  selector: 'app-availability-pricing',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './availability-pricing.component.html',
  styleUrl: './availability-pricing.component.scss',
})
export class AvailabilityPricingComponent {
  // Availability
  workingDays = {
    monday: true,
    tuesday: true,
    wednesday: true,
    thursday: true,
    friday: true,
    saturday: false,
    sunday: false
  };
  startTime = '09:00';
  endTime = '18:00';
  timezone = 'Europe/Paris (GMT+1)';

  // Pricing
  baseRate = 75;
  currency = 'EUR';
  privateRate = 250;
  minGroupSize = 1;
  maxGroupSize = 8;
  childPricing = '50% discount under 12';

  // Social Links
  socialLinks: SocialLink[] = [
    { platform: 'Instagram', username: '@username', icon: 'fa-brands fa-instagram', showOnProfile: true },
    { platform: 'TikTok', username: '@username', icon: 'fa-brands fa-tiktok', showOnProfile: false },
    { platform: 'YouTube', username: 'Channel URL', icon: 'fa-brands fa-youtube', showOnProfile: false },
    { platform: 'Website', username: 'https://yourwebsite.com', icon: 'fa-solid fa-globe', showOnProfile: true }
  ];

  // Inclusions
  whatsIncluded: Inclusion[] = [
    { text: 'Expert guide' },
    { text: 'Walking tour' }
  ];
  notIncluded: Inclusion[] = [
    { text: 'Food & drinks' },
    { text: 'Transport' }
  ];
  optionalAddons: { text: string; price: number }[] = [
    { text: 'Photographer', price: 50 }
  ];

  currencies = ['EUR', 'USD', 'GBP'];
  timezones = ['Europe/Paris (GMT+1)', 'Europe/London (GMT+0)', 'America/New_York (GMT-5)'];
  childPricingOptions = [
    '50% discount under 12',
    'Free under 6',
    '30% discount under 16',
    'No discount'
  ];

  toggleDay(day: keyof typeof this.workingDays) {
    this.workingDays[day] = !this.workingDays[day];
  }

  addBlackoutPeriod() {
    alert('Date picker would open here');
  }

  manageCalendar() {
    alert('Calendar integration would open here');
  }

  addIncluded() {
    this.whatsIncluded.push({ text: '' });
  }

  removeIncluded(index: number) {
    this.whatsIncluded.splice(index, 1);
  }

  addNotIncluded() {
    this.notIncluded.push({ text: '' });
  }

  removeNotIncluded(index: number) {
    this.notIncluded.splice(index, 1);
  }

  addAddon() {
    this.optionalAddons.push({ text: '', price: 0 });
  }

  removeAddon(index: number) {
    this.optionalAddons.splice(index, 1);
  }
}
