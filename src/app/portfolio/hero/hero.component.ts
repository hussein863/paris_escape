import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss'
})
export class HeroComponent {
  searchQuery = '';

  constructor(private router: Router) {}

  onSearch(): void {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/landing/experience'], { queryParams: { search: this.searchQuery } });
    } else {
      this.router.navigate(['/landing/experience']);
    }
  }

  onBrowseGuides(): void {
    this.router.navigate(['/landing/experience']);
  }
}
