import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface ExperienceFilters {
  search?: string;
  ordering?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  minDuration?: number;
  maxDuration?: number;
}

@Component({
  selector: 'app-filters-sidebar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './filters-sidebar.component.html',
  styleUrl: './filters-sidebar.component.scss'
})
export class FiltersSidebarComponent {
  @Output() filtersChanged = new EventEmitter<ExperienceFilters>();

  expandedSections = { language: true, price: true, duration: true, category: true, neighborhood: true };

  languages = [
    { name: 'English', checked: false }, { name: 'French', checked: false },
    { name: 'Spanish', checked: false }, { name: 'Arabic', checked: false }
  ];

  priceRanges = [
    { label: 'Under €50', min: 0, max: 50, checked: false },
    { label: '€50 - €100', min: 50, max: 100, checked: false },
    { label: '€100 - €200', min: 100, max: 200, checked: false },
    { label: 'Over €200', min: 200, max: 9999, checked: false }
  ];

  durations = [
    { label: 'Under 2 hours', min: 0, max: 2, checked: false },
    { label: '2-4 hours', min: 2, max: 4, checked: false },
    { label: '4-8 hours', min: 4, max: 8, checked: false },
    { label: 'Full day', min: 8, max: 99, checked: false }
  ];

  categories = [
    { name: 'Walking Tours', checked: false }, { name: 'Food & Wine', checked: false },
    { name: 'Museums & Art', checked: false }, { name: 'Photography', checked: false }
  ];

  neighborhoods = [
    { name: 'Marais', checked: false }, { name: 'Montmartre', checked: false },
    { name: 'Latin Quarter', checked: false }, { name: 'Saint-Germain', checked: false }
  ];

  availableToday = false;

  toggleSection(section: keyof typeof this.expandedSections): void {
    this.expandedSections[section] = !this.expandedSections[section];
  }

  onFilterChange(): void {
    const filters: ExperienceFilters = {};

    const activeCategory = this.categories.find(c => c.checked);
    if (activeCategory) filters.category = activeCategory.name;

    const activePrice = this.priceRanges.find(p => p.checked);
    if (activePrice) { filters.minPrice = activePrice.min; filters.maxPrice = activePrice.max; }

    const activeDuration = this.durations.find(d => d.checked);
    if (activeDuration) { filters.minDuration = activeDuration.min; filters.maxDuration = activeDuration.max; }

    this.filtersChanged.emit(filters);
  }

  clearAll(): void {
    this.categories.forEach(c => c.checked = false);
    this.priceRanges.forEach(p => p.checked = false);
    this.durations.forEach(d => d.checked = false);
    this.languages.forEach(l => l.checked = false);
    this.neighborhoods.forEach(n => n.checked = false);
    this.availableToday = false;
    this.filtersChanged.emit({});
  }
}
