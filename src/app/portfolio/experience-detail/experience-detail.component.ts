import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { ExperienceHeaderComponent } from './components/experience-header/experience-header.component';
import { ExperienceGalleryComponent } from './components/experience-gallery/experience-gallery.component';
import { BookingSidebarComponent } from './components/booking-sidebar/booking-sidebar.component';
import { ExperienceOverviewComponent } from './components/experience-overview/experience-overview.component';
import { MeetingPointComponent } from './components/meeting-point/meeting-point.component';
import { GuideProfileComponent } from './components/guide-profile/guide-profile.component';
import { ReviewsSectionComponent } from './components/reviews-section/reviews-section.component';
import { FaqSectionComponent } from './components/faq-section/faq-section.component';
import { PoliciesSectionComponent } from './components/policies-section/policies-section.component';
import { SimilarExperiencesComponent } from './components/similar-experiences/similar-experiences.component';
import { ExperienceService } from '../../core/services/experience.service';
import { ReviewService } from '../../core/services/review.service';
import { BookingService } from '../../core/services/booking.service';
import { FavoriteService } from '../../core/services/favorite.service';
import { AuthService } from '../../core/services/auth.service';
import { IdEncryptService } from '../../core/services/id-encrypt.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Experience } from '../../core/models';
import { RecentlyViewedComponent } from '../client/recently-viewed/recently-viewed.component';
import { AuthPromptModalComponent } from '../component/auth-prompt-modal/auth-prompt-modal.component';
import { BookingParams } from './components/booking-sidebar/booking-sidebar.component';

@Component({
  selector: 'app-experience-detail',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    HeaderComponent,
    FooterComponent,
    ExperienceHeaderComponent,
    ExperienceGalleryComponent,
    BookingSidebarComponent,
    ExperienceOverviewComponent,
    MeetingPointComponent,
    GuideProfileComponent,
    ReviewsSectionComponent,
    FaqSectionComponent,
    PoliciesSectionComponent,
    SimilarExperiencesComponent,
    AuthPromptModalComponent,
  ],
  templateUrl: './experience-detail.component.html',
  styleUrl: './experience-detail.component.scss'
})
export class ExperienceDetailComponent implements OnInit {
  // Data for components
  experienceData = {
    title: 'Private Louvre Masterpieces Tour',
    category: 'Art & Museums',
    location: 'Louvre District',
    rating: 4.9,
    reviewsCount: 127,
    badges: ['Originals', 'Instant confirmation', 'Free cancellation up to 24h']
  };

  galleryData = {
    images: [
      { url: '/assets/images/multi-image/jonconde.png', alt: 'Louvre Museum Mona Lisa' },
      { url: '/assets/images/multi-image/louvre.png', alt: 'Louvre Pyramid' },
      { url: '/assets/images/multi-image/statuette.png', alt: 'Louvre Gallery' },
      { url: '/assets/images/multi-image/musee.png', alt: 'Versailles Palace' },
      { url: '/assets/images/multi-image/bat.png', alt: 'Paris Architecture' }
    ],
    duration: '3 hours',
    maxGuests: 6
  };

  overviewData = {
    description: 'Skip the crowds and discover the Louvre\'s greatest treasures with an expert art historian guide. This private tour takes you through the world\'s largest museum, focusing on masterpieces like the Mona Lisa, Venus de Milo, and Winged Victory of Samothrace.',
    highlights: [
      { text: 'Skip-the-line access to the Louvre Museum' },
      { text: 'Private art historian guide with museum expertise' },
      { text: 'See famous works: Mona Lisa, Venus de Milo, Winged Victory' },
      { text: 'Learn fascinating stories behind the masterpieces' },
      { text: 'Small group experience (max 6 people)' }
    ],
    whatYouWillDo: 'Meet your expert guide at the Louvre pyramid and skip the long entrance lines. Explore the museum\'s most famous galleries while learning about the history, techniques, and stories behind each masterpiece. Your guide will share insider knowledge and answer all your questions about the art and the museum itself.',
    audienceTags: [
      { label: 'Art lovers' },
      { label: 'First-time visitors' },
      { label: 'History enthusiasts' },
      { label: 'Photography lovers' }
    ],
    itinerary: [
      {
        order: 1,
        title: 'Meet at Louvre Pyramid',
        duration: '15 minutes',
        description: 'Meet your guide at the glass pyramid entrance. Brief introduction and skip-the-line entry to the museum.'
      },
      {
        order: 2,
        title: 'Italian Renaissance Gallery',
        duration: '45 minutes',
        description: 'Start with the Mona Lisa and other Italian masterpieces. Learn about Leonardo da Vinci\'s techniques and the painting\'s fascinating history.'
      },
      {
        order: 3,
        title: 'Ancient Greek & Roman Art',
        duration: '60 minutes',
        description: 'Discover the Venus de Milo and Winged Victory of Samothrace. Explore the stories behind these iconic sculptures.'
      },
      {
        order: 4,
        title: 'French Paintings & Hidden Gems',
        duration: '60 minutes',
        description: 'Visit lesser-known but equally stunning works. End with French paintings and learn about the Louvre\'s role in French history.'
      }
    ],
    includedItems: [
      { text: 'Skip-the-line Louvre tickets', included: true },
      { text: 'Expert art historian guide', included: true },
      { text: 'Wireless headsets', included: true },
      { text: 'Small group experience', included: true },
      { text: 'Hotel pickup/drop-off', included: false },
      { text: 'Food and drinks', included: false },
      { text: 'Gratuities', included: false }
    ],
    whatToBring: [
      { text: 'Comfortable walking shoes', type: 'recommended' as const },
      { text: 'Valid ID or passport', type: 'required' as const },
      { text: 'Camera (no flash inside)', type: 'recommended' as const }
    ]
  };

  meetingPointData = {
    name: 'Louvre Pyramid',
    address: 'Rue de Rivoli, 75001 Paris, France',
    instructions: 'Meet at the glass pyramid entrance, near the information desk.',
    metro: 'Closest Metro: Palais-Royal (Lines 1, 7)'
  };

  guideData = {
    name: 'Sophie Laurent',
    avatar: 'assets/images/avatar/sophie.png',
    rating: 4.9,
    reviewsCount: 487,
    languages: ['French (Native)', 'English (Fluent)', 'Spanish (Intermediate)'],
    bio: 'Art historian and certified guide with 8 years of experience. Former museum curator specializing in Renaissance art and French cultural heritage.'
  };

  reviewsData = {
    reviews: [
      {
        author: 'Michael Chen',
        avatar: 'assets/images/avatar/james.png',
        rating: 5,
        date: '2 weeks ago',
        comment: 'Sophie was absolutely fantastic! Her knowledge of art history brought the Louvre to life. She knew exactly which pieces to show us and shared fascinating stories that you won\'t find in any guidebook. The skip-the-line access was worth it alone. Highly recommend!'
      },
      {
        author: 'Emma Williams',
        avatar: 'assets/images/avatar/emma.png',
        rating: 5,
        date: '1 month ago',
        comment: 'Perfect introduction to the Louvre! Sophie made sure we saw all the highlights while avoiding the worst crowds. Her explanations were engaging and easy to understand. The 3-hour duration was just right.'
      }
    ],
    averageRating: 4.9,
    totalReviews: 127
  };

  faqData = [
    {
      question: 'Is this tour wheelchair accessible?',
      answer: 'Yes, the Louvre is fully wheelchair accessible with elevators and ramps throughout the museum.',
      isOpen: false
    },
    {
      question: 'What happens if it rains?',
      answer: 'The tour takes place entirely indoors, so weather won\'t affect your experience.',
      isOpen: false
    },
    {
      question: 'Can I take photos inside?',
      answer: 'Yes, photography is allowed in most areas without flash. Your guide will inform you of any restricted zones.',
      isOpen: false
    }
  ];

  policiesData = [
    {
      title: 'Cancellation policy',
      description: 'Free cancellation up to 24 hours before the tour starts. Cancellations within 24 hours are non-refundable.'
    },
    {
      title: 'Late arrival & no-show',
      description: 'Please arrive 10 minutes early. Late arrivals may result in shortened tour time. No-shows are non-refundable.'
    },
    {
      title: 'Safety measures',
      description: 'All guides follow museum safety protocols. First aid trained guides available on request.'
    },
    {
      title: 'Insurance',
      description: 'Professional liability insurance included. Travel insurance recommended for international visitors.'
    }
  ];

  similarExperiencesData = [
    {
      id: '1',
      title: 'Musée d\'Orsay Impressionist Tour',
      image: 'assets/images/card_image/museeOrsay.png',
      duration: '2.5 hours',
      category: 'Art & Museums',
      price: 75,
      currency: '€',
      rating: 4.8
    },
    {
      id: '2',
      title: 'Versailles Palace Full Day',
      image: 'assets/images/card_image/versaille.png',
      duration: '8 hours',
      category: 'History & Culture',
      price: 120,
      currency: '€',
      rating: 4.9
    },
    {
      id: '3',
      title: 'Montmartre Art Walk',
      image: 'assets/images/card_image/monmartart.png',
      duration: '3 hours',
      category: 'Art & Culture',
      price: 65,
      currency: '€',
      rating: 4.7
    }
  ];

  experience: Experience | null = null;
  guideId: number | null = null;
  loading = false;
  error = '';
  // Favorites
  isFavorited = false;
  favoriteId: number | null = null;
  favoriteLoading = false;
  favoriteError = '';
  showAuthModal = false;
  authModalAction = '';

  // Review gating
  canReviewExperience = false;

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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private experienceService: ExperienceService,
    private reviewService: ReviewService,
    private bookingService: BookingService,
    private favoriteService: FavoriteService,
    public auth: AuthService,
    private http: HttpClient,
    private idEncrypt: IdEncryptService
  ) {}

  ngOnInit(): void {
    const encryptedId = this.route.snapshot.paramMap.get('encryptedId');
    if (!encryptedId) return;
    const id = this.idEncrypt.decryptId(encryptedId);
    if (id) {
      this.loadExperience(id);
      if (this.auth.isLoggedIn()) {
        this.checkFavoriteStatus(id);
        this.checkReviewEligibility(id);
      }
    }
  }

  loadExperience(id: number): void {
    this.loading = true;
    // Record view
    this.experienceService.recordView(id).subscribe({
      error: () => {} // View recording failure shouldn't block loading
    });
    this.experienceService.get(id).subscribe({
      next: (exp) => {
        this.experience = exp;
        this.mapToDisplayData(exp);
        this.loading = false;
        RecentlyViewedComponent.track(id);
        this.loadReviews(id, exp);
      },
      error: () => { this.error = 'Experience not found.'; this.loading = false; }
    });
  }

  private loadReviews(expId: number, exp: Experience): void {
    this.reviewService.list({ experience: expId }).subscribe({
      next: (res) => {
        this.reviewsData = {
          reviews: res.results.map(r => ({
            author: (r as any).customer_name || 'Anonymous',
            avatar: '',
            rating: r.rating,
            date: new Date(r.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
            comment: r.content,
            reply: r.reply ? { content: (r.reply as any).content, date: (r.reply as any).date } : null,
          })),
          averageRating: Number(exp.rating),
          totalReviews: res.count
        };
      }
    });
  }

  checkFavoriteStatus(expId: number): void {
    this.favoriteService.check(expId).subscribe({
      next: (res) => {
        const fav = res.results[0];
        if (fav) { this.isFavorited = true; this.favoriteId = fav.id; }
      }
    });
  }

  toggleFavorite(): void {
    if (!this.auth.isLoggedIn()) {
      this.authModalAction = 'save to your favourites';
      this.showAuthModal = true;
      return;
    }
    if (!this.experience) return;
    this.favoriteLoading = true;
    this.favoriteError = '';
    if (this.isFavorited && this.favoriteId) {
      this.favoriteService.remove(this.favoriteId).subscribe({
        next: () => { this.isFavorited = false; this.favoriteId = null; this.favoriteLoading = false; },
        error: () => { this.favoriteLoading = false; this.favoriteError = 'Could not remove from favorites.'; }
      });
    } else {
      this.favoriteService.add(this.experience.id).subscribe({
        next: (fav) => { this.isFavorited = true; this.favoriteId = fav.id; this.favoriteLoading = false; },
        error: (err) => {
          this.favoriteLoading = false;
          if (err?.status === 400) {
            this.checkFavoriteStatus(this.experience!.id);
          } else {
            this.favoriteError = 'Could not save to favorites.';
          }
        }
      });
    }
  }

  checkReviewEligibility(expId: number): void {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    this.bookingService.list().subscribe({
      next: (res) => {
        this.canReviewExperience = res.results.some(b =>
          b.experience === expId &&
          b.status === 'Confirmed' &&
          new Date(b.date) < today
        );
      }
    });
  }

  onWriteReviewClicked(): void {
    if (!this.auth.isLoggedIn()) {
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
    if (this.reviewRating === 0 || !this.reviewContent.trim()) return;
    this.reviewSubmitting = true;
    this.reviewError = '';
    this.reviewService.create({
      experience: this.experience!.id,
      guide: this.experience!.guide,
      rating: this.reviewRating,
      content: this.reviewContent,
    }).subscribe({
      next: (rev) => {
        this.reviewSubmitting = false;
        this.showReviewModal = false;
        const author = this.auth.user()?.name ?? 'You';
        this.reviewsData.reviews.unshift({ author, avatar: '', rating: rev.rating, date: 'Just now', comment: rev.content });
        this.reviewsData.totalReviews++;
      },
      error: () => {
        this.reviewSubmitting = false;
        this.reviewError = 'Failed to submit review. Please try again.';
      }
    });
  }

  onReportClicked(): void {
    if (!this.auth.isLoggedIn()) {
      this.authModalAction = 'report this experience';
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
      report_type: 'experience',
      experience: this.experience!.id,
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

  onContactRequested(): void {
    if (!this.auth.isLoggedIn()) {
      this.authModalAction = 'contact your guide';
      this.showAuthModal = true;
    } else {
      const queryParams = this.experience ? { experienceId: this.experience.id } : {};
      this.router.navigate(['/client/messages'], { queryParams });
    }
  }

  onBookRequested(params: BookingParams): void {
    if (!this.auth.isLoggedIn()) {
      this.authModalAction = 'book this experience';
      this.showAuthModal = true;
    } else {
      const encryptedId = this.idEncrypt.encryptId(this.experience!.id);
      this.router.navigate(['/landing/experience', encryptedId, 'book'], { queryParams: params });
    }
  }

  mapToDisplayData(exp: Experience): void {
    const expAny = exp as any;

    // Badges from experience properties
    const badges: string[] = [];
    if (expAny.is_original) badges.push('Originals');
    if (exp.policy?.cancellation_window) badges.push(`Free cancellation up to ${exp.policy.cancellation_window}`);
    badges.push('Instant confirmation');

    this.experienceData = {
      title: exp.title,
      category: exp.category,
      location: exp.subcategory || exp.category || 'Paris',
      rating: Number(exp.rating),
      reviewsCount: 0,
      badges
    };

    // Gallery: prefer uploaded media; fall back to cover image
    const mediaImages = (exp.media || [])
      .filter(m => m.type === 'image')
      .sort((a, b) => a.ordering - b.ordering)
      .map(m => ({ url: (m as any).file_url || m.url, alt: exp.title }));

    const coverUrl = expAny.image_url || exp.image;
    const galleryImages = mediaImages.length > 0
      ? mediaImages
      : coverUrl
        ? [{ url: coverUrl, alt: exp.title }]
        : [{ url: 'assets/images/multi-image/louvre.png', alt: exp.title }];

    this.galleryData = {
      images: galleryImages,
      duration: `${exp.duration_value} ${exp.duration_unit}`,
      maxGuests: exp.max_people
    };

    this.overviewData = {
      description: exp.long_description || exp.short_description,
      highlights: (exp.highlights || []).map((h: string) => ({ text: h })),
      whatYouWillDo: exp.short_description,
      audienceTags: (exp.tags || []).map((t: string) => ({ label: t })),
      itinerary: (exp.itinerary || []).map(item => ({
        order: item.order,
        title: item.title,
        duration: item.duration,
        description: item.description
      })),
      includedItems: (exp.inclusions || [])
        .filter(i => i.type === 'included' || i.type === 'not-included')
        .map(i => ({ text: i.text, included: i.type === 'included' })),
      whatToBring: (exp.inclusions || [])
        .filter(i => i.type === 'to-bring')
        .map(i => ({ text: i.text, type: 'recommended' as const }))
    };

    // Policies from real policy object
    if (exp.policy) {
      const p = exp.policy;
      const pols = [];
      if (p.cancellation_window) pols.push({ title: 'Cancellation policy', description: `Free cancellation up to ${p.cancellation_window} before the tour starts. Cancellations within this window are non-refundable.` });
      if (p.late_arrival_policy) pols.push({ title: 'Late arrival', description: { 'wait-15': 'Guide will wait up to 15 minutes.', 'start-on-time': 'Tour starts on time — please arrive 10 minutes early.', 'custom': 'Contact your guide for late arrival policy.' }[p.late_arrival_policy] || p.late_arrival_policy });
      if (p.weather_policy) pols.push({ title: 'Weather', description: { 'light-rain': 'Tour runs in light rain — bring an umbrella.', 'cancel-bad': 'Tour is cancelled in bad weather with full refund.', 'reschedule-severe': 'Tour rescheduled in severe weather.' }[p.weather_policy] || p.weather_policy });
      if (p.safety_notes) pols.push({ title: 'Safety', description: p.safety_notes });
      if (p.insurance_coverage) pols.push({ title: 'Insurance', description: 'Professional liability insurance included.' });
      this.policiesData = pols.length > 0 ? pols : this.policiesData;
    }

    // FAQ generated from experience policy + accessibility info
    const faqs: { question: string; answer: string; isOpen: boolean }[] = [];
    if (exp.wheelchair_accessible !== undefined) faqs.push({ question: 'Is this experience wheelchair accessible?', answer: exp.wheelchair_accessible ? 'Yes, this experience is fully wheelchair accessible.' : 'This experience is not fully wheelchair accessible. Contact the guide for details.', isOpen: false });
    if (exp.has_min_age && exp.min_age) faqs.push({ question: 'Is there a minimum age requirement?', answer: `Yes, participants must be at least ${exp.min_age} years old.`, isOpen: false });
    if (exp.languages?.length) faqs.push({ question: 'In which languages is this experience offered?', answer: `This experience is available in: ${exp.languages.join(', ')}.`, isOpen: false });
    if (exp.policy?.cancellation_window) faqs.push({ question: 'What is the cancellation policy?', answer: `You can cancel for free up to ${exp.policy.cancellation_window} before the start time.`, isOpen: false });
    if (exp.max_people) faqs.push({ question: 'What is the maximum group size?', answer: `This experience accommodates up to ${exp.max_people} people.`, isOpen: false });
    if (faqs.length > 0) this.faqData = faqs;

    // Guide profile
    this.guideId = exp.guide;
    this.http.get<any>(`${environment.apiUrl}/users/guides/${exp.guide}/`).subscribe({
      next: (guide) => {
        const user = guide.user;
        this.guideData = {
          name: user?.name ?? `Guide #${exp.guide}`,
          avatar: user?.avatar_url || user?.avatar || 'assets/images/avatar/sophie.png',
          rating: Number(guide.rating),
          reviewsCount: guide.review_count,
          languages: (guide.languages ?? []).map((l: any) => `${l.name} (${l.level})`),
          bio: guide.bio ?? ''
        };
        // Use first meeting point if available, else fall back to meeting_point_name
        const mp = guide.meeting_points?.[0];
        this.meetingPointData = {
          name: mp?.name || guide.meeting_point_name || 'Meeting point',
          address: mp?.address || guide.meeting_point_address || '',
          instructions: guide.pickup_options || '',
          metro: ''
        };
        // Also set review count on experience header
        this.experienceData = { ...this.experienceData, reviewsCount: guide.review_count };
      }
    });

    // Similar experiences
    this.experienceService.list({ search: exp.category }).subscribe({
      next: (res) => {
        this.similarExperiencesData = res.results
          .filter(e => e.id !== exp.id)
          .slice(0, 3)
          .map(e => ({
            id: String(e.id),
            title: e.title,
            image: (e as any).image_url || e.image || 'assets/images/card_image/louvre.png',
            duration: `${e.duration_value} ${e.duration_unit}`,
            category: e.category,
            price: Number(e.base_price),
            currency: '€',
            rating: Number(e.rating)
          }));
      }
    });
  }
}
