import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ExperienceService } from '../../../core/services/experience.service';
import { FavoriteService } from '../../../core/services/favorite.service';
import { AuthService } from '../../../core/services/auth.service';
import { Experience } from '../../../core/models';
import { ExperienceFilters } from '../filters-sidebar/filters-sidebar.component';

@Component({
  selector: 'app-experiences-grid',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './experiences-grid.component.html',
  styleUrl: './experiences-grid.component.scss'
})
export class ExperiencesGridComponent implements OnInit, OnChanges {
  @Input() filters: ExperienceFilters = {};
  @Output() totalChanged = new EventEmitter<number>();
  viewMode: 'grid' | 'circle' | 'list' = 'circle';
  selectedSort = 'relevance';
  currentPage = 1;
  itemsPerPage = 9;
  totalCount = 0;
  loading = false;

  experiences: Experience[] = [];
  favoriteIds = new Set<number>();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private experienceService: ExperienceService,
    private favoriteService: FavoriteService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    // Pick up ?search= query param from hero navigation
    const qp = this.route.snapshot.queryParamMap.get('search');
    if (qp) this.filters = { ...this.filters, search: qp };
    this.loadExperiences();
    if (this.auth.isLoggedIn()) this.loadFavorites();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['filters'] && !changes['filters'].firstChange) {
      this.currentPage = 1;
      // If only client-side filters changed (price/duration/category), re-filter without API call
      const prev = changes['filters'].previousValue as ExperienceFilters;
      const curr = changes['filters'].currentValue as ExperienceFilters;
      if (prev?.search === curr?.search) {
        this.applyFilters();
      } else {
        this.loadExperiences();
      }
    }
  }

  allExperiences: Experience[] = [];

  loadExperiences(): void {
    this.loading = true;
    const ordering = this.selectedSort === 'price_asc' ? 'base_price'
      : this.selectedSort === 'price_desc' ? '-base_price'
      : this.selectedSort === 'rating' ? '-rating'
      : undefined;

    const params: any = { ordering, page: this.currentPage };
    if (this.filters.search) params.search = this.filters.search;

    this.experienceService.list(params).subscribe({
      next: (res) => {
        this.allExperiences = res.results;
        this.applyFilters();
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  applyFilters(): void {
    let filtered = [...this.allExperiences];

    if (this.filters.category) {
      const cat = this.filters.category.toLowerCase();
      filtered = filtered.filter(e =>
        e.category?.toLowerCase().includes(cat) ||
        e.title?.toLowerCase().includes(cat)
      );
    }

    if (this.filters.minPrice !== undefined)
      filtered = filtered.filter(e => Number(e.base_price) >= this.filters.minPrice!);
    if (this.filters.maxPrice !== undefined)
      filtered = filtered.filter(e => Number(e.base_price) <= this.filters.maxPrice!);

    if (this.filters.minDuration !== undefined)
      filtered = filtered.filter(e => e.duration_value >= this.filters.minDuration!);
    if (this.filters.maxDuration !== undefined)
      filtered = filtered.filter(e => e.duration_value <= this.filters.maxDuration!);

    this.experiences = filtered;
    this.totalCount = filtered.length;
    this.totalChanged.emit(filtered.length);
  }

  loadFavorites(): void {
    this.favoriteService.list().subscribe({
      next: (res) => {
        this.favoriteIds = new Set(res.results.map(f => f.experience));
      }
    });
  }

  isFavorite(id: number): boolean { return this.favoriteIds.has(id); }

  toggleFavorite(experience: Experience): void {
    if (!this.auth.isLoggedIn()) { this.router.navigate(['/auth/login']); return; }
    if (this.isFavorite(experience.id)) {
      this.favoriteIds.delete(experience.id);
    } else {
      this.favoriteIds.add(experience.id);
      this.favoriteService.add(experience.id).subscribe();
    }
  }

  goToExperience(id: number): void { this.router.navigate(['/landing/experience', id]); }


  get totalPages(): number { return Math.ceil(this.totalCount / this.itemsPerPage); }
  get pageNumbers(): number[] { return Array.from({ length: this.totalPages }, (_, i) => i + 1); }

  setViewMode(mode: 'grid' | 'circle' | 'list'): void { this.viewMode = mode; }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadExperiences();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  nextPage(): void { this.goToPage(this.currentPage + 1); }
  previousPage(): void { this.goToPage(this.currentPage - 1); }

  getDuration(exp: Experience): string {
    return `${exp.duration_value} ${exp.duration_unit}`;
  }
}
