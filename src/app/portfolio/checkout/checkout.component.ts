import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ClientHeaderComponent } from '../client/client-header/client-header.component';
import { FooterComponent } from "../footer/footer.component";
import { HeaderComponent } from "../header/header.component";

interface CountryCode {
  code: string;
  dial: string;
}

interface AddOn {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
}

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, ClientHeaderComponent, FooterComponent, HeaderComponent],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent {
  currentStep = 1;

  // Experience details
  experienceTitle = 'Private Louvre Masterpieces Tour';
  experienceDate = 'Saturday, December 14, 2024';
  experienceTime = '10:00 AM - 1:00 PM (3 hours)';
  experienceLocation = 'Louvre Museum, Rue de Rivoli';
  experienceLanguages = 'English, French, Spanish';
  experienceImage = 'assets/images/card_image/musee.png';

  // Guests
  adultsCount = 2;

  // Selected Add-ons
  selectedAddons: AddOn[] = [
    {
      id: '1',
      name: 'Private Tour Upgrade',
      description: 'Exclusive experience for your group',
      price: 30,
      quantity: 2
    },
    {
      id: '2',
      name: 'Photography Session',
      description: 'Professional photos of your experience',
      price: 50,
      quantity: 1
    }
  ];

  // Pricing
  baseRate = 85;
  baseTourTotal = 170;
  privateUpgradeTotal = 60;
  photographyTotal = 50;
  serviceFee = 18;
  taxRate = 0.20;

  // Traveler Details
  firstName = '';
  lastName = '';
  email = '';
  phoneCode = '+33';
  phoneNumber = '';
  country = '';
  specialRequests = '';

  countryCodes: CountryCode[] = [
    { code: 'FR', dial: '+33' },
    { code: 'US', dial: '+1' },
    { code: 'UK', dial: '+44' },
    { code: 'ES', dial: '+34' },
    { code: 'DE', dial: '+49' }
  ];

  countries = ['France', 'United States', 'United Kingdom', 'Spain', 'Germany', 'Italy'];

  // Account Options
  accountOption: 'signin' | 'guest' = 'guest';
  createAccount = false;

  // Terms
  acceptTerms = false;
  receiveUpdates = false;

  // Promo
  promoCode = '';

  constructor(private router: Router) {}

  get subtotal(): number {
    return this.baseTourTotal + this.privateUpgradeTotal + this.photographyTotal;
  }

  get taxes(): number {
    return Math.round((this.subtotal + this.serviceFee) * this.taxRate * 100) / 100;
  }

  get total(): number {
    return this.subtotal + this.serviceFee + this.taxes;
  }

  incrementAdults() {
    this.adultsCount++;
  }

  decrementAdults() {
    if (this.adultsCount > 1) {
      this.adultsCount--;
    }
  }

  removeAddon(id: string) {
    this.selectedAddons = this.selectedAddons.filter(addon => addon.id !== id);
  }

  applyPromoCode() {
    // Implement promo code logic
    console.log('Applying promo code:', this.promoCode);
  }

  setAccountOption(option: 'signin' | 'guest') {
    this.accountOption = option;
  }

  continueToPayment() {
    if (!this.acceptTerms) {
      alert('Please accept the Terms of Service and Cancellation Policy');
      return;
    }

    if (!this.firstName || !this.lastName || !this.email || !this.phoneNumber) {
      alert('Please fill in all required fields');
      return;
    }

    this.currentStep = 2;
    // Navigate to payment step
  }

  viewCancellationPolicy() {
    // Open cancellation policy modal or page
  }
}
