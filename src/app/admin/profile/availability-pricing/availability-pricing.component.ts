import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GuideProfileService } from '../../../core/services/guide-profile.service';

interface Inclusion {
  text: string;
}

@Component({
  selector: 'app-availability-pricing',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './availability-pricing.component.html',
  styleUrl: './availability-pricing.component.scss',
})
export class AvailabilityPricingComponent implements OnInit {
  // Availability
  workingDays: Record<string, boolean> = {
    monday: true,
    tuesday: true,
    wednesday: true,
    thursday: true,
    friday: true,
    saturday: false,
    sunday: false,
  };
  startTime = '09:00';
  endTime = '18:00';
  timezone = 'Europe/Paris';

  // Pricing
  baseRate = 0;
  defaultCurrency = 'EUR';
  privateRate = 0;
  minGroupSize = 1;
  maxGroupSize = 8;
  childPricing = 'No discount';

  // Social Links
  instagram = '';
  showInstagram = true;
  tiktok = '';
  showTiktok = false;
  youtube = '';
  showYoutube = false;
  website = '';
  showWebsite = true;

  // Inclusions (local only, no DB backing in current scope)
  whatsIncluded: Inclusion[] = [{ text: 'Expert guide' }, { text: 'Walking tour' }];
  notIncluded: Inclusion[] = [{ text: 'Food & drinks' }, { text: 'Transport' }];
  optionalAddons: { text: string; price: number }[] = [{ text: 'Photographer', price: 50 }];

  currencies = ['EUR', 'USD', 'GBP'];
  timezones = ['Europe/Paris', 'Europe/London', 'America/New_York'];
  childPricingOptions = ['50% discount under 12', 'Free under 6', '30% discount under 16', 'No discount'];
  dayKeys = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  dayLabels: Record<string, string> = {
    monday: 'M', tuesday: 'T', wednesday: 'W', thursday: 'T',
    friday: 'F', saturday: 'S', sunday: 'S',
  };

  savingSocial = false;
  savingAvailability = false;
  savingPricing = false;
  savingInclusions = false;
  toast: { message: string; type: 'success' | 'error' } | null = null;
  private toastTimer: any;

  constructor(private guideService: GuideProfileService) {}

  showToast(message: string, type: 'success' | 'error' = 'success'): void {
    clearTimeout(this.toastTimer);
    this.toast = { message, type };
    this.toastTimer = setTimeout(() => { this.toast = null; }, 3500);
  }

  ngOnInit(): void {
    this.guideService.profile$.subscribe(p => {
      if (!p) return;
      if (p.working_days && Object.keys(p.working_days).length > 0) {
        this.workingDays = { ...this.workingDays, ...p.working_days };
      }
      this.startTime = p.availability_start_time;
      this.endTime = p.availability_end_time;
      this.timezone = p.timezone;
      this.baseRate = p.base_rate;
      this.defaultCurrency = p.default_currency;
      this.privateRate = p.private_rate;
      this.minGroupSize = p.min_group_size;
      this.maxGroupSize = p.max_group_size;
      this.childPricing = p.child_pricing;
      this.instagram = p.instagram;
      this.showInstagram = p.show_instagram;
      this.tiktok = p.tiktok;
      this.showTiktok = p.show_tiktok;
      this.youtube = p.youtube;
      this.showYoutube = p.show_youtube;
      this.website = p.website;
      this.showWebsite = p.show_website;
    });
  }

  toggleDay(day: string): void { this.workingDays[day] = !this.workingDays[day]; }

  saveSocial(): void {
    this.savingSocial = true;
    let website = this.website.trim();
    if (website && !website.startsWith('http://') && !website.startsWith('https://')) {
      website = 'https://' + website;
      this.website = website;
    }
    this.guideService.patch({
      instagram: this.instagram, show_instagram: this.showInstagram,
      tiktok: this.tiktok, show_tiktok: this.showTiktok,
      youtube: this.youtube, show_youtube: this.showYoutube,
      website, show_website: this.showWebsite,
    }).subscribe({
      next: () => { this.savingSocial = false; this.showToast('Social links saved!'); },
      error: (err) => {
        this.savingSocial = false;
        const errors = err?.error;
        if (errors && typeof errors === 'object') {
          const field = Object.keys(errors)[0];
          const msg = Array.isArray(errors[field]) ? errors[field][0] : errors[field];
          this.showToast(`${field}: ${msg}`, 'error');
        } else {
          this.showToast('Failed to save social links.', 'error');
        }
      },
    });
  }

  saveAvailability(): void {
    this.savingAvailability = true;
    this.guideService.patch({
      working_days: { ...this.workingDays },
      availability_start_time: this.startTime,
      availability_end_time: this.endTime,
      timezone: this.timezone,
    }).subscribe({
      next: () => { this.savingAvailability = false; this.showToast('Availability saved!'); },
      error: () => { this.savingAvailability = false; this.showToast('Failed to save availability.', 'error'); },
    });
  }

  savePricing(): void {
    this.savingPricing = true;
    this.guideService.patch({
      base_rate: this.baseRate, default_currency: this.defaultCurrency,
      private_rate: this.privateRate, min_group_size: this.minGroupSize,
      max_group_size: this.maxGroupSize, child_pricing: this.childPricing,
    }).subscribe({
      next: () => { this.savingPricing = false; this.showToast('Pricing saved!'); },
      error: () => { this.savingPricing = false; this.showToast('Failed to save pricing.', 'error'); },
    });
  }

  saveInclusions(): void {
    this.savingInclusions = true;
    // Inclusions are local-only for now, simulate save
    setTimeout(() => {
      this.savingInclusions = false;
      this.showToast('Inclusions saved!');
    }, 500);
  }

  addIncluded(): void { this.whatsIncluded.push({ text: '' }); }
  removeIncluded(i: number): void { this.whatsIncluded.splice(i, 1); }
  addNotIncluded(): void { this.notIncluded.push({ text: '' }); }
  removeNotIncluded(i: number): void { this.notIncluded.splice(i, 1); }
  addAddon(): void { this.optionalAddons.push({ text: '', price: 0 }); }
  removeAddon(i: number): void { this.optionalAddons.splice(i, 1); }
}
