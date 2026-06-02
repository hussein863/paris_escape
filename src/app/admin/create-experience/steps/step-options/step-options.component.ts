import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface AddOn {
  id: string;
  title: string;
  description: string;
  icon: string;
  price: number;
  pricingType: 'per-person' | 'per-booking';
  selected: boolean;
}

interface CustomOption {
  id: string;
  name: string;
  description: string;
  price: number;
  pricingType: 'per-person' | 'per-booking';
}

@Component({
  selector: 'app-step-options',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './step-options.component.html',
  styleUrl: './step-options.component.scss',
})
export class StepOptionsComponent {
  @Output() dataChange = new EventEmitter<any>();

  popularAddOns: AddOn[] = [
    {
      id: 'private',
      title: 'Private Experience',
      description: 'Upgrade to a private tour just for your group',
      icon: 'fa-users',
      price: 120,
      pricingType: 'per-booking',
      selected: false
    },
    {
      id: 'photos',
      title: 'Professional Photos',
      description: 'Get professional photos during your experience',
      icon: 'fa-camera',
      price: 45,
      pricingType: 'per-person',
      selected: false
    },
    {
      id: 'extra-time',
      title: 'Extra Time',
      description: 'Extend your experience by 30 minutes',
      icon: 'fa-clock',
      price: 25,
      pricingType: 'per-person',
      selected: false
    },
    {
      id: 'hotel-pickup',
      title: 'Hotel Pickup',
      description: 'Pick up from your hotel in Paris',
      icon: 'fa-car',
      price: 35,
      pricingType: 'per-booking',
      selected: false
    }
  ];

  customOptions: CustomOption[] = [];

  showAddOptionModal = false;
  newOption: CustomOption = {
    id: '',
    name: '',
    description: '',
    price: 0,
    pricingType: 'per-person'
  };

  addOnTips = [
    {
      icon: 'fa-lightbulb',
      color: 'yellow',
      title: 'Increase your earnings',
      description: 'Add-ons can boost your revenue by 20-40% per booking.'
    },
    {
      icon: 'fa-star',
      color: 'blue',
      title: 'Enhance the experience',
      description: 'Offer extras that create memorable moments for travelers.'
    },
    {
      icon: 'fa-users',
      color: 'green',
      title: 'Think about value',
      description: 'Price options based on the extra value they provide.'
    }
  ];

  popularAddOnStats = [
    { name: 'Professional Photos', uptake: 78 },
    { name: 'Private Experience', uptake: 45 },
    { name: 'Hotel Pickup', uptake: 62 },
    { name: 'Extra Time', uptake: 34 }
  ];

  get optionsChecklist() {
    const selectedAddOns = this.popularAddOns.filter(a => a.selected).length;
    return {
      addedPopular: selectedAddOns > 0,
      competitivePrices: selectedAddOns > 0 || this.customOptions.length > 0,
      clearDescriptions: false,
      testedCombinations: selectedAddOns >= 2 || this.customOptions.length > 0
    };
  }

  get potentialEarningsBoost(): number {
    const selectedCount = this.popularAddOns.filter(a => a.selected).length + this.customOptions.length;
    if (selectedCount >= 2) return 35;
    if (selectedCount === 1) return 15;
    return 0;
  }

  get selectedAddOnsCount(): number {
    return this.popularAddOns.filter(a => a.selected).length + this.customOptions.length;
  }

  get addOnPluralText(): string {
    return this.selectedAddOnsCount > 1 ? 's' : '';
  }

  toggleAddOn(addOn: AddOn): void {
    addOn.selected = !addOn.selected;
    this.emitData();
  }

  openAddOptionModal(): void {
    this.showAddOptionModal = true;
    this.newOption = {
      id: '',
      name: '',
      description: '',
      price: 0,
      pricingType: 'per-person'
    };
  }

  closeAddOptionModal(): void {
    this.showAddOptionModal = false;
  }

  saveCustomOption(): void {
    if (this.newOption.name && this.newOption.price > 0) {
      this.newOption.id = 'custom-' + Date.now();
      this.customOptions.push({ ...this.newOption });
      this.closeAddOptionModal();
      this.emitData();
    }
  }

  removeCustomOption(optionId: string): void {
    this.customOptions = this.customOptions.filter(o => o.id !== optionId);
    this.emitData();
  }

  emitData(): void {
    const selectedAddOns = this.popularAddOns.filter(a => a.selected);
    this.dataChange.emit({
      selectedAddOns,
      customOptions: this.customOptions
    });
  }
}
