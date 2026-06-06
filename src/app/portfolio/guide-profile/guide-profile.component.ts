import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { IdEncryptService } from '../../core/services/id-encrypt.service';
import { ProfileHeaderComponent } from './profile-header/profile-header.component';
import { ProfileAboutComponent } from './profile-about/profile-about.component';
import { ProfileLocationComponent } from './profile-location/profile-location.component';
import { ProfileExperiencesComponent } from './profile-experiences/profile-experiences.component';
import { ProfileReviewsComponent } from './profile-reviews/profile-reviews.component';
import { ProfileSidebarComponent } from './profile-sidebar/profile-sidebar.component';
import { ProfileSimilarGuidesComponent } from './profile-similar-guides/profile-similar-guides.component';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
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
  specialties: string[];
  meetingPoint: { name: string; address: string };
  pickupOptions: string;
  accessibility: string;
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
    RouterModule,
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
  ) {}

  ngOnInit(): void {
    const encryptedId = this.route.snapshot.paramMap.get('encryptedId');
    if (!encryptedId) { this.router.navigate(['/landing']); return; }
    const id = this.idEncrypt.decryptId(encryptedId);
    if (!id) { this.router.navigate(['/landing']); return; }
    this.loadGuide(id);
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
        this.similarGuides = allGuides.results
          .filter((g: any) => g.id !== id)
          .slice(0, 4)
          .map((g: any) => this.mapSimilarGuide(g));
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
      specialties: (g.specialties ?? []).map((s: any) => s.name),
      meetingPoint: {
        name: (g.meeting_points ?? []).find((m: any) => m.is_default)?.name ?? g.meeting_point_name ?? '',
        address: (g.meeting_points ?? []).find((m: any) => m.is_default)?.address ?? g.meeting_point_address ?? '',
      },
      pickupOptions: g.pickup_options ?? '',
      accessibility: g.accessibility ?? '',
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
      name: user.name ?? 'Guide',
      image: user.avatar_url ?? 'assets/images/card_image/person/jean-pierre.png',
      languages: (g.languages ?? []).map((l: any) => l.name.slice(0, 2).toUpperCase()).join(', '),
      rating: parseFloat(g.rating ?? 0),
      reviewCount: g.review_count ?? 0,
      specialty: (g.specialties ?? []).map((s: any) => s.name).join(', '),
    };
  }
}
