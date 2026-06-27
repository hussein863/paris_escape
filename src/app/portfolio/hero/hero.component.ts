import { Component, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { IdEncryptService } from '../../core/services/id-encrypt.service';
import { environment } from '../../../environments/environment';

interface SearchSuggestion {
  id: number;
  title: string;
  category: string;
  base_price: number;
  currency: string;
  image_url: string | null;
}

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss'
})
export class HeroComponent {
  searchQuery = '';
  suggestions: SearchSuggestion[] = [];
  showDropdown = false;
  searchLoading = false;
  private _debounce: any = null;

  constructor(
    private router: Router,
    private http: HttpClient,
    private idEncrypt: IdEncryptService,
    private elRef: ElementRef
  ) {}

  onSearchInput(): void {
    clearTimeout(this._debounce);
    const q = this.searchQuery.trim();
    if (q.length < 2) {
      this.suggestions = [];
      this.showDropdown = false;
      return;
    }
    this.searchLoading = true;
    this._debounce = setTimeout(() => {
      this.http.get<SearchSuggestion[]>(`${environment.apiUrl}/experiences/search/?q=${encodeURIComponent(q)}`).subscribe({
        next: (results) => {
          this.suggestions = results;
          this.showDropdown = results.length > 0;
          this.searchLoading = false;
        },
        error: () => { this.searchLoading = false; }
      });
    }, 300);
  }

  selectSuggestion(exp: SearchSuggestion): void {
    this.searchQuery = exp.title;
    this.showDropdown = false;
    this.suggestions = [];
    const encryptedId = this.idEncrypt.encryptId(exp.id);
    this.router.navigate(['/landing/experience', encryptedId]);
  }

  closeDropdown(): void {
    setTimeout(() => {
      this.showDropdown = false;
    }, 150);
  }

  onSearch(): void {
    this.showDropdown = false;
    if (this.searchQuery.trim()) {
      this.router.navigate(['/landing/experience'], { queryParams: { search: this.searchQuery } });
    } else {
      this.router.navigate(['/landing/experience']);
    }
  }

  onBrowseGuides(): void {
    this.router.navigate(['/landing/experience']);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elRef.nativeElement.contains(event.target)) {
      this.showDropdown = false;
    }
  }
}
