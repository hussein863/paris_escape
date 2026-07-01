import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ExperienceService } from '../../../core/services/experience.service';
import { FavoriteService } from '../../../core/services/favorite.service';
import { AuthService } from '../../../core/services/auth.service';
import { IdEncryptService } from '../../../core/services/id-encrypt.service';
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
    private auth: AuthService,
    private idEncrypt: IdEncryptService
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
      : this.selectedSort === 'duration' ? 'duration_value'
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
      // Remove from favorites
      this.favoriteIds.delete(experience.id);
      this.favoriteService.list().subscribe({
        next: (res) => {
          const favRecord = res.results.find(f => f.experience === experience.id);
          if (favRecord) {
            this.favoriteService.remove(favRecord.id).subscribe({
              error: () => this.favoriteIds.add(experience.id)
            });
          }
        }
      });
    } else {
      // Add to favorites
      this.favoriteIds.add(experience.id);
      this.favoriteService.add(experience.id).subscribe({
        next: () => { /* Success, keep in local set */ },
        error: () => this.favoriteIds.delete(experience.id)
      });
    }
  }

  goToExperience(id: number): void {
    const encryptedId = this.idEncrypt.encryptId(id);
    this.router.navigate(['/landing/experience', encryptedId]);
  }


  get totalPages(): number { return Math.ceil(this.totalCount / this.itemsPerPage); }
  get pageNumbers(): number[] { return Array.from({ length: this.totalPages }, (_, i) => i + 1); }


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

  // ── Sponsorship CTA ──────────────────────────────────────────────────────

  sponsorPanelOpen = false;
  sponsoredExperience: Experience | null = null;
  sponsorFeature: 'search' | 'listing' = 'search';
  sponsorDays = 7;
  readonly sponsorPrices: Record<string, number> = { search: 2, listing: 3 };

  isOwnExperience(exp: Experience): boolean {
    const user = this.auth.user();
    if (!user?.guide_profile) return false;
    return exp.guide === user.guide_profile.id;
  }

  openSponsorPanel(exp: Experience, event: Event): void {
    event.stopPropagation();
    this.sponsoredExperience = exp;
    this.sponsorFeature = 'search';
    this.sponsorDays = 7;
    this.sponsorPanelOpen = true;
  }

  closeSponsorPanel(): void {
    this.sponsorPanelOpen = false;
    this.sponsoredExperience = null;
  }

  get sponsorTotal(): number {
    return this.sponsorPrices[this.sponsorFeature] * this.sponsorDays;
  }
}
