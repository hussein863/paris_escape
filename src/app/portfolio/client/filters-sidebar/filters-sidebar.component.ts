import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-filters-sidebar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './filters-sidebar.component.html',
  styleUrl: './filters-sidebar.component.scss'
})
export class FiltersSidebarComponent {
  expandedSections = {
    language: true,
    price: true,
    duration: true,
    category: true,
    neighborhood: true
  };

  languages = [
    { name: 'English', checked: true },
    { name: 'French', checked: false },
    { name: 'Spanish', checked: false },
    { name: 'Arabic', checked: false }
  ];

  priceRanges = [
    { label: 'Under €50', checked: false },
    { label: '€50 - €100', checked: true },
    { label: '€100 - €200', checked: false },
    { label: 'Over €200', checked: false }
  ];

  durations = [
    { label: 'Under 2 hours', checked: false },
    { label: '2-4 hours', checked: false },
    { label: '4-8 hours', checked: false },
    { label: 'Full day', checked: false }
  ];

  categories = [
    { name: 'Walking Tours', checked: false },
    { name: 'Food & Wine', checked: false },
    { name: 'Museums & Art', checked: false },
    { name: 'Photography', checked: false }
  ];

  neighborhoods = [
    { name: 'Marais', checked: false },
    { name: 'Montmartre', checked: false },
    { name: 'Latin Quarter', checked: false },
    { name: 'Saint-Germain', checked: false }
  ];

  availableToday = false;

  toggleSection(section: keyof typeof this.expandedSections): void {
    this.expandedSections[section] = !this.expandedSections[section];
  }
}
