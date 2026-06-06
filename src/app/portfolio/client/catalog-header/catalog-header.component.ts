import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExperienceFilters } from '../filters-sidebar/filters-sidebar.component';

interface Category { id: string; name: string; active: boolean; }

@Component({
  selector: 'app-catalog-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './catalog-header.component.html',
  styleUrl: './catalog-header.component.scss'
})
export class CatalogHeaderComponent {
  @Input() totalCount = 0;
  @Input() activeFilters: ExperienceFilters = {};
  @Output() categorySelected = new EventEmitter<string>();
  @Output() clearFilters = new EventEmitter<void>();
  @Output() filterDrawerToggled = new EventEmitter<boolean>();
  filterDrawerOpen = false;

  categories: Category[] = [
    { id: 'romantic', name: 'Romantic', active: false },
    { id: 'unusual', name: 'Unusual', active: false },
    { id: 'photo', name: 'Photo', active: false },
    { id: 'family', name: 'Family', active: false },
    { id: 'food', name: 'Food & Wine', active: false },
    { id: 'culture', name: 'Culture', active: false }
  ];

  get activeFilterLabels(): string[] {
    const labels: string[] = [];
    if (this.activeFilters.category) labels.push(this.activeFilters.category);
    return labels;
  }

  get hasActiveFilters(): boolean {
    return Object.keys(this.activeFilters).some(k => !!(this.activeFilters as any)[k]);
  }

  get experiencesCount(): number { return this.totalCount; }

  toggleCategory(category: Category): void {
    this.categories.forEach(c => c.active = false);
    category.active = !category.active;
    this.categorySelected.emit(category.active ? category.name : '');
  }

  onClearAll(): void {
    this.categories.forEach(c => c.active = false);
    this.clearFilters.emit();
  }
}
