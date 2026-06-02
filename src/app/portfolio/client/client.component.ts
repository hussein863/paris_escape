import { Component } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { FooterComponent } from "../footer/footer.component";
import { RouterModule } from "@angular/router";
import { CatalogHeaderComponent } from './catalog-header/catalog-header.component';
import { FiltersSidebarComponent } from './filters-sidebar/filters-sidebar.component';
import { ExperiencesGridComponent } from './experiences-grid/experiences-grid.component';
import { RecentlyViewedComponent } from './recently-viewed/recently-viewed.component';
import { ShareYourParisComponent } from './share-your-paris/share-your-paris.component';

@Component({
  selector: 'app-client',
  standalone: true,
  imports: [
    HeaderComponent,
    FooterComponent,
    RouterModule,
    CatalogHeaderComponent,
    FiltersSidebarComponent,
    ExperiencesGridComponent,
    RecentlyViewedComponent,
    ShareYourParisComponent
  ],
  templateUrl: './client.component.html',
  styleUrl: './client.component.scss'
})
export class ClientComponent {

}
