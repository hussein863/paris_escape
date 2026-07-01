import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { IdEncryptService } from '../../core/services/id-encrypt.service';

@Component({
  selector: 'app-sa-reviews',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reviews.component.html',
  styleUrl: './reviews.component.scss'
})
export class SaReviewsComponent {
  search = '';
  filterRating = '';
  reviews: any[] = [];
  loading = true;

  constructor(private http: HttpClient, private idEncrypt: IdEncryptService) {
    this.load();
  }

  load(): void {
    this.http.get<any>(`${environment.apiUrl}/superadmin/reviews/`).subscribe({
      next: (res) => { this.reviews = res.results ?? res; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  get filtered(): any[] {
    return this.reviews.filter(r => {
      const matchSearch = !this.search ||
        r.customer_name?.toLowerCase().includes(this.search.toLowerCase()) ||
        r.guide_name?.toLowerCase().includes(this.search.toLowerCase()) ||
        r.experience_title?.toLowerCase().includes(this.search.toLowerCase()) ||
        r.content?.toLowerCase().includes(this.search.toLowerCase());
      const matchRating = !this.filterRating || r.rating === +this.filterRating;
      return matchSearch && matchRating;
    });
  }

  remove(id: number, event: Event): void {
    event.stopPropagation();
    if (!confirm('Remove this review? This cannot be undone.')) return;
    this.http.delete(`${environment.apiUrl}/superadmin/reviews/${id}/`)
      .subscribe(() => this.reviews = this.reviews.filter(r => r.id !== id));
  }

  openGuideProfile(guideProfileId: number, event: Event): void {
    event.stopPropagation();
    window.open(`/landing/profil/${this.idEncrypt.encryptId(guideProfileId)}`, '_blank');
  }

  openExperience(expId: number, event: Event): void {
    event.stopPropagation();
    window.open(`/landing/experience/${this.idEncrypt.encryptId(expId)}`, '_blank');
  }

  initials(name: string): string {
    const parts = (name || '').trim().split(' ');
    return parts.length >= 2
      ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
      : (name || '?').substring(0, 2).toUpperCase();
  }

  stars(n: number): number[]      { return Array(n).fill(0); }
  emptyStars(n: number): number[] { return Array(5 - n).fill(0); }
}
