import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CardPersonComponent, Guide } from '../component/card-person/card-person.component';
import { IdEncryptService } from '../../core/services/id-encrypt.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-guides-by-language',
  standalone: true,
  imports: [CommonModule, CardPersonComponent],
  templateUrl: './guides-by-language.component.html',
  styleUrl: './guides-by-language.component.scss'
})
export class GuidesByLanguageComponent implements OnInit {
  languages = ['English', 'French', 'Spanish', 'Arabic'];
  selectedLanguage = 'English';
  allGuides: Guide[] = [];
  loading = true;

  constructor(
    private http: HttpClient,
    private router: Router,
    private idEncrypt: IdEncryptService,
  ) {}

  ngOnInit(): void {
    this.http.get<{ results: any[] }>(`${environment.apiUrl}/users/guides/`).subscribe({
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

  get filteredGuides(): Guide[] {
    if (!this.allGuides.length) return [];
    return this.allGuides.filter(g => g.languages.includes(this.selectedLanguage)).slice(0, 8);
  }

  selectLanguage(language: string): void {
    this.selectedLanguage = language;
  }

  onViewAllGuides(): void {
    this.router.navigate(['/landing/guides'], { queryParams: { language: this.selectedLanguage } });
  }
}
