import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CatalogHeaderComponent } from './catalog-header/catalog-header.component';
import { FiltersSidebarComponent, ExperienceFilters } from './filters-sidebar/filters-sidebar.component';
import { ExperiencesGridComponent } from './experiences-grid/experiences-grid.component';
import { RecentlyViewedComponent } from './recently-viewed/recently-viewed.component';
import { ShareYourParisComponent } from './share-your-paris/share-your-paris.component';

@Component({
  selector: 'app-client',
  standalone: true,
  imports: [
    CommonModule, HeaderComponent, FooterComponent, RouterModule,
    CatalogHeaderComponent, FiltersSidebarComponent,
    ExperiencesGridComponent, RecentlyViewedComponent, ShareYourParisComponent
  ],
  templateUrl: './client.component.html',
  styleUrl: './client.component.scss'
})
export class ClientComponent implements OnInit {
  activeFilters: ExperienceFilters = {};
  totalCount = 0;
  mobileFiltersOpen = false;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const search = this.route.snapshot.queryParamMap.get('search');
    if (search) this.activeFilters = { search };
  }

  onFiltersChanged(filters: ExperienceFilters): void {
    this.activeFilters = { ...this.activeFilters, ...filters };
    this.mobileFiltersOpen = false;
  }

  onTotalChanged(count: number): void {
    this.totalCount = count;
  }
}
