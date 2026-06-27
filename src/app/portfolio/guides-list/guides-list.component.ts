import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CardPersonComponent, Guide } from '../component/card-person/card-person.component';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { IdEncryptService } from '../../core/services/id-encrypt.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-guides-list',
  standalone: true,
  imports: [CommonModule, FormsModule, CardPersonComponent, HeaderComponent, FooterComponent],
  templateUrl: './guides-list.component.html',
  styleUrl: './guides-list.component.scss'
})
export class GuidesListComponent implements OnInit {
  readonly languages = ['All', 'English', 'French', 'Spanish', 'Arabic'];
  selectedLanguage = 'All';
  searchQuery = '';
  allGuides: Guide[] = [];
  loading = true;
  private _debounce: any = null;

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private idEncrypt: IdEncryptService,
  ) {}

  ngOnInit(): void {
    const lang = this.route.snapshot.queryParamMap.get('language');
    if (lang && this.languages.includes(lang)) {
      this.selectedLanguage = lang;
    }
    this.fetchGuides();
  }

  private fetchGuides(): void {
    this.loading = true;
    let url = `${environment.apiUrl}/users/guides/?ordering=-rating`;
    if (this.searchQuery.trim()) {
      url += `&search=${encodeURIComponent(this.searchQuery.trim())}`;
    }
    if (this.selectedLanguage !== 'All') {
      url += `&language=${encodeURIComponent(this.selectedLanguage)}`;
    }
    this.http.get<{ results: any[] }>(url).subscribe({
      next: (res) => {
        this.allGuides = res.results.map(g => ({
          id: g.id,
          encryptedId: this.idEncrypt.encryptId(g.id),
          name: g.user?.name ?? `Guide #${g.id}`,
          specialty: (g.specialties ?? []).map((s: any) => s.name).join(', ') || 'Paris Expert',
          rating: parseFloat(g.rating ?? 0),
          reviewCount: g.review_count ?? 0,
          photo: g.user?.avatar_url ?? g.user?.avatar ?? 'assets/images/avatar/sophie.png',
          languages: (g.languages ?? []).map((l: any) => l.name),
        }));
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  selectLanguage(lang: string): void {
    this.selectedLanguage = lang;
    this.fetchGuides();
  }

  onSearchInput(): void {
    clearTimeout(this._debounce);
    this._debounce = setTimeout(() => this.fetchGuides(), 350);
  }

  get totalCount(): number { return this.allGuides.length; }
}
