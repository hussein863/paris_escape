import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ExperienceService } from '../../../core/services/experience.service';
import { ReviewService } from '../../../core/services/review.service';
import { Experience, Review, User } from '../../../core/models';

@Component({
  selector: 'app-experience-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './experience.component.html',
  styleUrl: './experience.component.scss',
})
export class ExperienceComponent implements OnInit {
  user: User | null = null;
  experiences: Experience[] = [];
  recentReviews: Review[] = [];

  expLoading = true;
  reviewLoading = true;

  constructor(
    private auth: AuthService,
    private experienceService: ExperienceService,
    private reviewService: ReviewService,
  ) {}

  ngOnInit(): void {
    this.user = this.auth.user();
    this.loadExperiences();
  }

  private loadExperiences(): void {
    this.experienceService.list().subscribe({
      next: (res) => {
        this.experiences = res.results.slice(0, 5);
        this.expLoading = false;
        // Once we have experiences, load reviews for this guide
        if (this.user?.guide_profile?.id) {
          this.loadReviews(this.user.guide_profile.id);
        }
      },
      error: () => { this.expLoading = false; }
    });
  }

  private loadReviews(guideId: number): void {
    this.reviewService.list({ guide: guideId }).subscribe({
      next: (res) => {
        this.recentReviews = res.results.slice(0, 2);
        this.reviewLoading = false;
      },
      error: () => { this.reviewLoading = false; }
    });
  }

  navigateToCreate(): void { /* handled by routerLink */ }

  editExperience(id: number): void { /* handled by routerLink */ }

  get activeCount(): number { return this.experiences.filter(e => e.status === 'Active').length; }
  get draftCount(): number { return this.experiences.filter(e => e.status === 'Draft').length; }

  get kycStatus(): 'verified' | 'pending' | 'incomplete' {
    const status = this.user?.status;
    if (status === 'Active') return 'verified';
    if (status === 'KYC Pending') return 'pending';
    return 'incomplete';
  }

  get subscriptionPlan(): string { return 'Pro Plan'; }

  get contactQuotaUsed(): number { return 0; }
  get contactQuotaTotal(): number { return 50; }

  get avgRating(): number { return this.user?.guide_profile?.rating ?? 0; }

  ratingStars(rating: number): boolean[] {
    return [1, 2, 3, 4, 5].map(s => s <= Math.round(rating));
  }
}
