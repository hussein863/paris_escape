import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Category {
  id: string;
  name: string;
  active: boolean;
}

interface ActiveFilter {
  id: string;
  label: string;
  type: string;
}

@Component({
  selector: 'app-catalog-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './catalog-header.component.html',
  styleUrl: './catalog-header.component.scss'
})
export class CatalogHeaderComponent {
  experiencesCount = 127;

  categories: Category[] = [
    { id: 'romantic', name: 'Romantic', active: false },
    { id: 'unusual', name: 'Unusual', active: false },
    { id: 'photo', name: 'Photo', active: false },
    { id: 'family', name: 'Family', active: false },
    { id: 'food', name: 'Food', active: false },
    { id: 'culture', name: 'Culture', active: false }
  ];

  activeFilters: ActiveFilter[] = [
    { id: 'english', label: 'English', type: 'language' },
    { id: 'price-50-100', label: '€50-€100', type: 'price' }
  ];

  toggleCategory(category: Category): void {
    category.active = !category.active;
  }

  removeFilter(filter: ActiveFilter): void {
    this.activeFilters = this.activeFilters.filter(f => f.id !== filter.id);
  }

  clearAll(): void {
    this.activeFilters = [];
    this.categories.forEach(cat => cat.active = false);
  }

  hasActiveFilters(): boolean {
    return this.activeFilters.length > 0;
  }
}
