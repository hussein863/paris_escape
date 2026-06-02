import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-step-pricing',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './step-pricing.component.html',
  styleUrl: './step-pricing.component.scss',
})
export class StepPricingComponent {
  @Output() dataChange = new EventEmitter<any>();

  formData = {
    pricingModel: 'per-person',
    currency: 'EUR (€)',
    basePrice: 45,
    childPricingEnabled: false,
    childPrice: 0,
    childAgeRange: '3-12'
  };

  pricingModels = [
    {
      id: 'per-person',
      title: 'Per Person',
      icon: 'fa-user',
      description: 'Travelers pay per person joining the experience. Best for group activities.',
      example: 'Example: €45 × 3 people = €135'
    },
    {
      id: 'private',
      title: 'Private Experience',
      icon: 'fa-users',
      description: 'Fixed price regardless of group size. Perfect for exclusive experiences.',
      example: 'Example: €200 for up to 6 people'
    }
  ];

  pricingTips = [
    {
      icon: 'fa-lightbulb',
      color: 'yellow',
      title: 'Research competitors',
      description: 'Check similar experiences in Paris to price competitively.'
    },
    {
      icon: 'fa-chart-line',
      color: 'blue',
      title: 'Start lower, increase later',
      description: 'Build reviews and demand, then optimize pricing.'
    },
    {
      icon: 'fa-users',
      color: 'green',
      title: 'Consider group dynamics',
      description: 'Per-person works for tours, private for intimate experiences.'
    }
  ];

  marketInsights = {
    averagePrice: 52,
    category: '2-hour cultural experiences',
    lowPrice: 35,
    highPrice: 85
  };

  get platformFee(): number {
    return this.formData.basePrice * 0.05;
  }

  get paymentProcessing(): number {
    return this.formData.basePrice * 0.03;
  }

  get totalFees(): number {
    return this.platformFee + this.paymentProcessing;
  }

  get yourEarnings(): number {
    return this.formData.basePrice - this.platformFee;
  }

  get pricingChecklist() {
    return {
      modelSelected: !!this.formData.pricingModel,
      basePriceSet: this.formData.basePrice > 0,
      childPricing: this.formData.childPricingEnabled,
      groupSizeLimits: false
    };
  }

  get exampleTotal(): number {
    return this.formData.basePrice * 2;
  }

  get examplePlatformFee(): number {
    return this.exampleTotal * 0.05;
  }

  get exampleProcessing(): number {
    return this.exampleTotal * 0.03;
  }

  get exampleTravelerTotal(): number {
    return this.exampleTotal + this.examplePlatformFee + this.exampleProcessing;
  }

  get exampleYourEarnings(): number {
    return this.exampleTotal - this.examplePlatformFee;
  }

  selectPricingModel(modelId: string): void {
    this.formData.pricingModel = modelId;
    this.emitData();
  }

  onDataChange(): void {
    this.emitData();
  }

  emitData(): void {
    this.dataChange.emit(this.formData);
  }
}
