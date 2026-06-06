import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ClientHeaderComponent } from '../client-header/client-header.component';
import { FavoriteService } from '../../../core/services/favorite.service';
import { ExperienceService } from '../../../core/services/experience.service';
import { IdEncryptService } from '../../../core/services/id-encrypt.service';
import { Favorite, Experience } from '../../../core/models';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ClientHeaderComponent],
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss']
})
export class FavoritesComponent implements OnInit {
  activeTab: 'guides' | 'experiences' = 'experiences';
  searchQuery = '';
  loading = false;

  favoriteRecords: Favorite[] = [];
  favoriteExperiences: Experience[] = [];

  moods = ['Romantic', 'Family', 'Food', 'Photo', 'Culture'];
  languages = ['FR', 'EN', 'ES', 'AR'];
  selectedMoods: string[] = [];
  selectedLanguages: string[] = [];

  constructor(
    private favoriteService: FavoriteService,
    private experienceService: ExperienceService,
    private router: Router,
    private idEncrypt: IdEncryptService
  ) {}

  private loadFavoritesData(): void {
    this.loading = true;
    this.favoriteService.list().subscribe({
      next: (res) => {
        this.favoriteRecords = res.results;
        this.favoriteExperiences = [];
        res.results.forEach(fav => {
          this.experienceService.get(fav.experience).subscribe({
            next: (exp) => this.favoriteExperiences.push(exp)
          });
        });
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  ngOnInit(): void {
    this.loadFavoritesData();
  }

  removeFromFavorites(experience: Experience, event: Event): void {
    event.stopPropagation();
    const fav = this.favoriteRecords.find(f => f.experience === experience.id);
    if (!fav) return;
    this.favoriteService.remove(fav.id).subscribe({
      next: () => {
        this.favoriteRecords = this.favoriteRecords.filter(f => f.id !== fav.id);
        this.favoriteExperiences = this.favoriteExperiences.filter(e => e.id !== experience.id);
      }
    });
  }

  viewExperience(experience: Experience): void {
    const encryptedId = this.idEncrypt.encryptId(experience.id);
    this.router.navigate(['/landing/experience', encryptedId]);
  }

  get filteredExperiences(): Experience[] {
    let list = [...this.favoriteExperiences];

    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      list = list.filter(e =>
        e.title.toLowerCase().includes(q) || e.category.toLowerCase().includes(q)
      );
    }

    if (this.selectedMoods.length > 0) {
      list = list.filter(e =>
        this.selectedMoods.some(m => e.category?.toLowerCase().includes(m.toLowerCase()) ||
          (e as any).tags?.some((t: string) => t.toLowerCase().includes(m.toLowerCase())))
      );
    }

    if (this.selectedLanguages.length > 0) {
      list = list.filter(e =>
        this.selectedLanguages.some(l =>
          (e as any).languages?.some((lang: string) => lang.toLowerCase().startsWith(l.toLowerCase()))
        )
      );
    }

    return list;
  }

  get experienceCount(): number { return this.favoriteExperiences.length; }

  setActiveTab(tab: 'guides' | 'experiences'): void { this.activeTab = tab; }
  toggleMood(mood: string): void {
    const i = this.selectedMoods.indexOf(mood);
    i > -1 ? this.selectedMoods.splice(i, 1) : this.selectedMoods.push(mood);
  }
  toggleLanguage(lang: string): void {
    const i = this.selectedLanguages.indexOf(lang);
    i > -1 ? this.selectedLanguages.splice(i, 1) : this.selectedLanguages.push(lang);
  }
  isMoodSelected(mood: string): boolean { return this.selectedMoods.includes(mood); }
  isLanguageSelected(lang: string): boolean { return this.selectedLanguages.includes(lang); }
}
