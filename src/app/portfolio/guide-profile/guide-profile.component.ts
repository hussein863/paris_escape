import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { IdEncryptService } from '../../core/services/id-encrypt.service';
import { MessagingService } from '../../core/services/messaging.service';
import { AuthService } from '../../core/services/auth.service';
import { BookingService } from '../../core/services/booking.service';
import { ReviewService } from '../../core/services/review.service';
import { ProfileHeaderComponent } from './profile-header/profile-header.component';
import { ProfileAboutComponent } from './profile-about/profile-about.component';
import { ProfileLocationComponent } from './profile-location/profile-location.component';
import { ProfileExperiencesComponent } from './profile-experiences/profile-experiences.component';
import { ProfileReviewsComponent } from './profile-reviews/profile-reviews.component';
import { ProfileSidebarComponent } from './profile-sidebar/profile-sidebar.component';
import { ProfileSimilarGuidesComponent } from './profile-similar-guides/profile-similar-guides.component';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { FormsModule } from '@angular/forms';
import { AuthPromptModalComponent } from '../component/auth-prompt-modal/auth-prompt-modal.component';
import { environment } from '../../../environments/environment';

export interface Guide {
  id: number;
  name: string;
  avatar: string;
  coverImage: string;
  isVerified: boolean;
  isOriginal: boolean;
  languages: { name: string; level: string }[];
  location: string;
  experience: string;
  rating: number;
  reviewCount: number;
  totalTours: number;
  priceRange: string;
  responseTime: string;
  about: string;
  headline: string;
  specialties: string[];
  meetingPoint: { name: string; address: string };
  pickupOptions: string;
  accessibility: string;
  // Contact & social
  publicEmail: string;
  showEmail: boolean;
  publicPhone: string;
  showPhone: boolean;
  instagram: string;
  showInstagram: boolean;
  tiktok: string;
  showTiktok: boolean;
  youtube: string;
  showYoutube: boolean;
  website: string;
  showWebsite: boolean;
  companyName: string;
  // Policies
  cancellationWindow: string;
  latePolicyNotes: string;
  safetyNotes: string;
  // Pricing
  childPricing: string;
  minGroupSize: number;
  maxGroupSize: number;
}

export interface Experience {
  id: number;
  title: string;
  description: string;
  image: string;
  duration: string;
  maxPeople: number;
  difficulty: string;
  included: string[];
  price: number;
  isFavorite: boolean;
  badge?: string;
}

export interface Review {
  id: number;
  author: string;
  avatar: string;
  rating: number;
  date: string;
  tourName: string;
  content: string;
  reply?: { content: string; date: string } | null;
}

export interface SimilarGuide {
  id: number;
  encryptedId: string;
  name: string;
  image: string;
  languages: string;
  rating: number;
  reviewCount: number;
  specialty: string;
}

@Component({
  selector: 'app-guide-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    AuthPromptModalComponent,
    ProfileHeaderComponent,
    ProfileAboutComponent,
    ProfileLocationComponent,
    ProfileExperiencesComponent,
    ProfileReviewsComponent,
    ProfileSidebarComponent,
    ProfileSimilarGuidesComponent,
    HeaderComponent,
    FooterComponent,
  ],
  templateUrl: './guide-profile.component.html',
  styleUrl: './guide-profile.component.scss'
})
export class GuideProfileComponent implements OnInit {
  loading = true;
  error = '';
  messageSending = false;

  guideId: number | null = null;

  // Review gating
  canReviewGuide = false;

  // Auth modal
  showAuthModal = false;
  authModalAction = '';

  // Review modal
  showReviewModal = false;
  reviewRating = 0;
  reviewContent = '';
  reviewSubmitting = false;
  reviewError = '';

  // Report modal
  showReportModal = false;
  reportReason = '';
  reportDescription = '';
  reportSubmitting = false;
  reportError = '';
  reportSuccess = false;
  guide!: Guide;
  experiences: Experience[] = [];
  reviews: Review[] = [];
  reviewStats = { average: 0, total: 0, distribution: [] as { stars: number; count: number }[] };
  similarGuides: SimilarGuide[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private idEncrypt: IdEncryptService,
    private messagingService: MessagingService,
    private bookingService: BookingService,
    private reviewService: ReviewService,
    public authService: AuthService,
  ) {}

  ngOnInit(): void {
    const encryptedId = this.route.snapshot.paramMap.get('encryptedId');
    if (!encryptedId) { this.router.navigate(['/landing']); return; }
    const id = this.idEncrypt.decryptId(encryptedId);
    if (!id) { this.router.navigate(['/landing']); return; }
    this.guideId = id;
    this.loadGuide(id);
    if (this.authService.isLoggedIn()) {
      this.checkReviewEligibility(id);
    }
  }

  loadGuide(id: number): void {
    forkJoin({
      guide: this.http.get<any>(`${environment.apiUrl}/users/guides/${id}/`),
      experiences: this.http.get<any>(`${environment.apiUrl}/experiences/?guide=${id}`).pipe(catchError(() => of({ results: [] }))),
      reviews: this.http.get<any>(`${environment.apiUrl}/reviews/?guide=${id}`).pipe(catchError(() => of({ results: [] }))),
      allGuides: this.http.get<any>(`${environment.apiUrl}/users/guides/`).pipe(catchError(() => of({ results: [] }))),
    }).subscribe({
      next: ({ guide, experiences, reviews, allGuides }) => {
        this.guide = this.mapGuide(guide);
        this.experiences = experiences.results.map((e: any) => this.mapExperience(e));
        this.reviews = reviews.results.map((r: any) => this.mapReview(r));
        this.reviewStats = this.buildStats(reviews.results);
        const others = allGuides.results.filter((g: any) => g.id !== id);
        // Shuffle randomly
        for (let i = others.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [others[i], others[j]] = [others[j], others[i]];
        }
        this.similarGuides = others.slice(0, 4).map((g: any) => this.mapSimilarGuide(g));
        this.loading = false;
      },
      error: () => {
        this.error = 'Guide not found.';
        this.loading = false;
      }
    });
  }

  private mapGuide(g: any): Guide {
    const user = g.user ?? {};
    const minPrice = g.base_rate ?? g.private_rate ?? 0;
    const maxPrice = g.private_rate ?? g.base_rate ?? 0;
    return {
      id: g.id,
      name: user.name ?? 'Guide',
      avatar: user.avatar_url ?? user.avatar ?? '',
      coverImage: g.cover_image_url ?? g.cover_image ?? 'assets/images/profil/bg.png',
      isVerified: g.is_verified ?? false,
      isOriginal: g.is_original ?? false,
      languages: (g.languages ?? []).map((l: any) => ({ name: l.name, level: l.level })),
      location: [g.neighborhood, g.base_city, 'France'].filter(Boolean).join(', '),
      experience: g.years_of_experience ? `${g.years_of_experience} years` : '',
      rating: parseFloat(g.rating ?? 0),
      reviewCount: g.review_count ?? 0,
      totalTours: g.total_tours ?? 0,
      priceRange: minPrice ? `€${minPrice} – €${Math.max(minPrice, maxPrice)}` : '',
      responseTime: g.response_time ?? '',
      about: g.bio ?? '',
      headline: g.headline ?? '',
      specialties: (g.specialties ?? []).map((s: any) => s.name),
      meetingPoint: {
        name: (g.meeting_points ?? []).find((m: any) => m.is_default)?.name ?? g.meeting_point_name ?? '',
        address: (g.meeting_points ?? []).find((m: any) => m.is_default)?.address ?? g.meeting_point_address ?? '',
      },
      pickupOptions: g.pickup_options ?? '',
      accessibility: g.accessibility ?? '',
      // Contact & social
      publicEmail: g.show_email_on_profile ? (g.public_email ?? '') : '',
      showEmail: g.show_email_on_profile ?? false,
      publicPhone: g.show_phone_on_profile ? (g.public_phone ?? '') : '',
      showPhone: g.show_phone_on_profile ?? false,
      instagram: g.show_instagram ? (g.instagram ?? '') : '',
      showInstagram: g.show_instagram ?? false,
      tiktok: g.show_tiktok ? (g.tiktok ?? '') : '',
      showTiktok: g.show_tiktok ?? false,
      youtube: g.show_youtube ? (g.youtube ?? '') : '',
      showYoutube: g.show_youtube ?? false,
      website: g.show_website ? (g.website ?? '') : '',
      showWebsite: g.show_website ?? false,
      companyName: g.company_name ?? '',
      // Policies
      cancellationWindow: g.cancellation_window ?? '',
      latePolicyNotes: g.late_policy_notes ?? '',
      safetyNotes: g.safety_notes ?? '',
      // Pricing
      childPricing: g.child_pricing ?? '',
      minGroupSize: g.min_group_size ?? 1,
      maxGroupSize: g.max_group_size ?? 8,
    };
  }

  private mapExperience(e: any): Experience {
    const inclusions = (e.inclusions ?? [])
      .filter((i: any) => i.type === 'included')
      .map((i: any) => i.text);
    return {
      id: e.id,
      title: e.title,
      description: e.short_description ?? '',
      image: e.image_url ?? e.image ?? '',
      duration: e.duration_value ? `${e.duration_value} ${e.duration_unit}` : '',
      maxPeople: e.max_people ?? 10,
      difficulty: e.difficulty ?? 'Easy',
      included: inclusions,
      price: parseFloat(e.base_price ?? 0),
      isFavorite: false,
    };
  }

  private mapReview(r: any): Review {
    return {
      id: r.id,
      author: r.customer_name ?? `Customer #${r.customer}`,
      avatar: r.customer_avatar ?? '',
      rating: r.rating,
      date: new Date(r.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      tourName: r.experience_title ?? '',
      content: r.content,
      reply: r.reply ? { content: r.reply.content, date: r.reply.date } : null,
    };
  }

  private buildStats(reviews: any[]): typeof this.reviewStats {
    const total = reviews.length;
    const avg = total ? reviews.reduce((s: number, r: any) => s + r.rating, 0) / total : 0;
    const dist = [5, 4, 3, 2, 1].map(stars => ({
      stars,
      count: reviews.filter((r: any) => r.rating === stars).length,
    }));
    return { average: Math.round(avg * 10) / 10, total, distribution: dist };
  }

  private mapSimilarGuide(g: any): SimilarGuide {
    const user = g.user ?? {};
    return {
      id: g.id,
      encryptedId: this.idEncrypt.encryptId(g.id),
      name: user.name ?? 'Guide',
      image: user.avatar_url ?? user.avatar ?? 'assets/images/card_image/person/jean-pierre.png',
      languages: (g.languages ?? []).map((l: any) => l.name).join(', '),
      rating: parseFloat(g.rating ?? 0),
      reviewCount: g.review_count ?? 0,
      specialty: (g.specialties ?? []).map((s: any) => s.name).join(', '),
    };
  }

  checkReviewEligibility(guideId: number): void {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    this.bookingService.list().subscribe({
      next: (res) => {
        this.canReviewGuide = res.results.some(b =>
          b.guide === guideId &&
          b.status === 'Confirmed' &&
          new Date(b.date) < today
        );
      }
    });
  }

  onWriteReviewClicked(): void {
    if (!this.authService.isLoggedIn()) {
      this.authModalAction = 'write a review';
      this.showAuthModal = true;
      return;
    }
    this.reviewRating = 0;
    this.reviewContent = '';
    this.reviewError = '';
    this.showReviewModal = true;
  }

  submitReview(): void {
    if (this.reviewRating === 0 || !this.reviewContent.trim() || !this.experiences.length) return;
    this.reviewSubmitting = true;
    this.reviewError = '';
    this.reviewService.create({
      experience: this.experiences[0].id,
      guide: this.guideId!,
      rating: this.reviewRating,
      content: this.reviewContent,
    }).subscribe({
      next: (rev) => {
        this.reviewSubmitting = false;
        this.showReviewModal = false;
        const author = this.authService.user()?.name ?? 'You';
        this.reviews.unshift(this.mapReview({ ...rev, customer_name: author }));
        this.reviewStats = this.buildStats([...this.reviews.map(r => ({ rating: r.rating }))]);
      },
      error: () => {
        this.reviewSubmitting = false;
        this.reviewError = 'Failed to submit review. Please try again.';
      }
    });
  }

  onReportGuideClicked(): void {
    if (!this.authService.isLoggedIn()) {
      this.authModalAction = 'report this guide';
      this.showAuthModal = true;
      return;
    }
    this.reportReason = '';
    this.reportDescription = '';
    this.reportError = '';
    this.reportSuccess = false;
    this.showReportModal = true;
  }

  submitReport(): void {
    if (!this.reportReason || !this.reportDescription.trim()) return;
    this.reportSubmitting = true;
    this.reportError = '';
    this.reviewService.report({
      report_type: 'guide',
      guide: this.guideId!,
      reason: this.reportReason,
      description: this.reportDescription,
    }).subscribe({
      next: () => {
        this.reportSubmitting = false;
        this.reportSuccess = true;
      },
      error: () => {
        this.reportSubmitting = false;
        this.reportError = 'Failed to submit report. Please try again.';
      }
    });
  }

  messageGuide(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/auth/login']);
      return;
    }
    if (!this.guideId) return;
    this.messageSending = true;
    this.messagingService.startConversation(this.guideId).subscribe({
      next: (conv) => {
        this.messageSending = false;
        this.router.navigate(['/client/messages'], { queryParams: { conversationId: conv.id } });
      },
      error: () => { this.messageSending = false; }
    });
  }
}
