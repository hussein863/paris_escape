import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface InclusionItem {
  id: string;
  text: string;
  type: 'included' | 'not-included' | 'to-bring';
}

interface Template {
  id: string;
  title: string;
  description: string;
  included: string[];
  notIncluded: string[];
  toBring: string[];
}

@Component({
  selector: 'app-step-inclusions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './step-inclusions.component.html',
  styleUrl: './step-inclusions.component.scss',
})
export class StepInclusionsComponent {
  @Output() dataChange = new EventEmitter<any>();

  includedItems: InclusionItem[] = [
    { id: 'inc1', text: 'Professional local guide', type: 'included' },
    { id: 'inc2', text: 'Walking tour with commentary', type: 'included' },
    { id: 'inc3', text: 'Small group experience (max 8 people)', type: 'included' }
  ];

  notIncludedItems: InclusionItem[] = [
    { id: 'ninc1', text: 'Transportation to meeting point', type: 'not-included' },
    { id: 'ninc2', text: 'Food and drinks', type: 'not-included' },
    { id: 'ninc3', text: 'Museum entrance fees', type: 'not-included' }
  ];

  toBringItems: InclusionItem[] = [
    { id: 'bring1', text: 'Comfortable walking shoes', type: 'to-bring' },
    { id: 'bring2', text: 'Weather-appropriate clothing', type: 'to-bring' },
    { id: 'bring3', text: 'Camera or smartphone', type: 'to-bring' }
  ];

  showAddModal = false;
  currentModalType: 'included' | 'not-included' | 'to-bring' = 'included';
  newItemText = '';

  templates: Template[] = [
    {
      id: 'walking-tour',
      title: 'Walking Tour',
      description: 'Standard walking tour inclusions',
      included: ['Professional local guide', 'Walking tour with commentary', 'Small group experience'],
      notIncluded: ['Transportation', 'Food and drinks', 'Gratuities'],
      toBring: ['Comfortable walking shoes', 'Weather-appropriate clothing', 'Water bottle']
    },
    {
      id: 'food-experience',
      title: 'Food Experience',
      description: 'Food tour or cooking class items',
      included: ['Professional chef/guide', 'All food tastings', 'Recipe cards', 'Cooking equipment'],
      notIncluded: ['Transportation', 'Additional drinks', 'Gratuities'],
      toBring: ['Appetite', 'Camera', 'Comfortable clothing']
    },
    {
      id: 'museum-visit',
      title: 'Museum Visit',
      description: 'Museum or cultural site tour',
      included: ['Professional guide', 'Skip-the-line tickets', 'Audio equipment', 'Small group'],
      notIncluded: ['Transportation', 'Food and drinks', 'Hotel pickup'],
      toBring: ['Valid ID', 'Comfortable shoes', 'Camera (if allowed)']
    },
    {
      id: 'photo-tour',
      title: 'Photo Tour',
      description: 'Photography-focused experience',
      included: ['Professional photographer guide', 'Photo tips and techniques', 'Photo spots map'],
      notIncluded: ['Camera equipment', 'Transportation', 'Photo editing'],
      toBring: ['Camera or smartphone', 'Extra batteries', 'Comfortable shoes']
    }
  ];

  inclusionTips = [
    {
      icon: 'fa-lightbulb',
      color: 'yellow',
      title: 'Be specific',
      description: 'Clear details prevent misunderstandings and increase bookings.'
    },
    {
      icon: 'fa-star',
      color: 'blue',
      title: 'Highlight value',
      description: 'Emphasize what makes your experience special and worth the price.'
    },
    {
      icon: '<img src="assets/images/question.svg" alt="Question">',
      color: 'green',
      title: 'Set expectations',
      description: 'Clear "not included" items help travelers budget properly.'
    }
  ];

  commonInclusions = [
    'Professional guide',
    'Small group size',
    'Walking commentary',
    'Photo opportunities',
    'Local insights'
  ];

  typicallyNotIncluded = [
    'Transportation costs',
    'Food and drinks',
    'Museum entrance fees',
    'Personal expenses',
    'Gratuities'
  ];

  get setupProgress() {
    return {
      whatsIncluded: this.includedItems.length > 0,
      whatsNotIncluded: this.notIncludedItems.length > 0,
      whatToBring: this.toBringItems.length > 0
    };
  }

  openAddModal(type: 'included' | 'not-included' | 'to-bring'): void {
    this.currentModalType = type;
    this.showAddModal = true;
    this.newItemText = '';
  }

  closeAddModal(): void {
    this.showAddModal = false;
    this.newItemText = '';
  }

  addItem(): void {
    if (!this.newItemText.trim()) return;

    const newItem: InclusionItem = {
      id: `item-${Date.now()}`,
      text: this.newItemText.trim(),
      type: this.currentModalType
    };

    if (this.currentModalType === 'included') {
      this.includedItems.push(newItem);
    } else if (this.currentModalType === 'not-included') {
      this.notIncludedItems.push(newItem);
    } else {
      this.toBringItems.push(newItem);
    }

    this.closeAddModal();
    this.emitData();
  }

  removeItem(itemId: string, type: 'included' | 'not-included' | 'to-bring'): void {
    if (type === 'included') {
      this.includedItems = this.includedItems.filter(item => item.id !== itemId);
    } else if (type === 'not-included') {
      this.notIncludedItems = this.notIncludedItems.filter(item => item.id !== itemId);
    } else {
      this.toBringItems = this.toBringItems.filter(item => item.id !== itemId);
    }
    this.emitData();
  }

  applyTemplate(template: Template): void {
    // Clear existing items
    this.includedItems = template.included.map((text, index) => ({
      id: `inc-${Date.now()}-${index}`,
      text,
      type: 'included' as const
    }));

    this.notIncludedItems = template.notIncluded.map((text, index) => ({
      id: `ninc-${Date.now()}-${index}`,
      text,
      type: 'not-included' as const
    }));

    this.toBringItems = template.toBring.map((text, index) => ({
      id: `bring-${Date.now()}-${index}`,
      text,
      type: 'to-bring' as const
    }));

    this.emitData();
  }

  previewExperience(): void {
    console.log('Preview experience');
    // Placeholder for preview functionality
  }

  emitData(): void {
    this.dataChange.emit({
      included: this.includedItems,
      notIncluded: this.notIncludedItems,
      toBring: this.toBringItems
    });
  }
}
