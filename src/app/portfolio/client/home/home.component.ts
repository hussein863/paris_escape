import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ClientHeaderComponent } from '../client-header/client-header.component';
import { AuthService } from '../../../core/services/auth.service';
import { BookingService } from '../../../core/services/booking.service';
import { MessagingService } from '../../../core/services/messaging.service';
import { FavoriteService } from '../../../core/services/favorite.service';
import { ExperienceService } from '../../../core/services/experience.service';
import { PaymentService } from '../../../core/services/payment.service';
import { WeatherService, WeatherData } from '../../../core/services/weather.service';
import { Booking, Conversation, Experience } from '../../../core/models';

interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  route?: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, ClientHeaderComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  userName = '';
  loading = true;

  // Stats
  upcomingCount = 0;
  upcomingSubtitle = 'No upcoming trips';
  unreadCount = 0;
  savedCount = 0;
  completedCount = 0;

  // Weather
  weather: WeatherData = { temp: 0, description: 'Loading...', tip: '' };
  weatherLoaded = false;

  // Data
  reservations: Booking[] = [];
  conversations: Conversation[] = [];
  favoriteExperiences: Experience[] = [];
  tasks: Task[] = [];

  moods = [
    { icon: 'fa-heart', label: 'Romantic', search: 'romantic' },
    { icon: 'fa-users', label: 'Family', search: 'family' },
    { icon: 'fa-utensils', label: 'Food', search: 'food' },
    { icon: 'fa-camera', label: 'Photo', search: 'photography' },
    { icon: 'fa-palette', label: 'Culture', search: 'culture' }
  ];

  constructor(
    private auth: AuthService,
    private bookingService: BookingService,
    private messagingService: MessagingService,
    private favoriteService: FavoriteService,
    private experienceService: ExperienceService,
    private paymentService: PaymentService,
    private weatherService: WeatherService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = this.auth.user();
    this.userName = user?.name?.split(' ')[0] ?? 'there';
    this.loadDashboard();
    this.loadWeather();
    this.computeTasks();
  }

  // ─── Navigation ──────────────────────────────────────────────────────────────
  searchExperiences(): void { this.router.navigate(['/landing/experience']); }
  browseGuides(): void { this.router.navigate(['/landing/profil']); }
  contactSupport(): void { this.router.navigate(['/support']); }
  goToReservations(): void { this.router.navigate(['/client/reservations']); }
  goToMessages(): void { this.router.navigate(['/client/messages']); }
  goToFavorites(): void { this.router.navigate(['/client/favorites']); }
  goToFAQs(): void { this.router.navigate(['/support']); }
  goToDisputes(): void { this.router.navigate(['/client/reservations'], { queryParams: { tab: 'disputes' } }); }

  discoverByMood(search: string): void {
    this.router.navigate(['/landing/experience'], { queryParams: { search } });
  }

  // ─── Data loading ────────────────────────────────────────────────────────────
  loadDashboard(): void {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    this.bookingService.list().subscribe({
      next: (res) => {
        const upcoming = res.results.filter(b =>
          (b.status === 'Confirmed' || b.status === 'Pending') && new Date(b.date) >= today
        );
        const completed = res.results.filter(b =>
          b.status === 'Confirmed' && new Date(b.date) < today
        );
        this.reservations = upcoming.slice(0, 3);
        this.upcomingCount = upcoming.length;
        this.completedCount = completed.length;
        this.upcomingSubtitle = upcoming.length > 0
          ? `Next: ${new Date(upcoming[0].date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
          : 'No upcoming trips';
      }
    });

    this.messagingService.listConversations().subscribe({
      next: (res) => {
        this.conversations = res.results.slice(0, 3);
        this.unreadCount = res.count;
      }
    });

    this.favoriteService.list().subscribe({
      next: (res) => {
        this.savedCount = res.count;
        res.results.slice(0, 3).forEach(fav => {
          this.experienceService.get(fav.experience).subscribe({
            next: (exp) => this.favoriteExperiences.push(exp)
          });
        });
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  loadWeather(): void {
    this.weatherService.getParisWeather().subscribe({
      next: (w) => { this.weather = w; this.weatherLoaded = true; },
      error: () => { this.weather = { temp: 18, description: 'Partly cloudy in Paris', tip: 'Bring a light jacket for the evening.' }; this.weatherLoaded = true; }
    });
  }

  computeTasks(): void {
    const user = this.auth.user();
    this.tasks = [];

    if (!user?.phone || !user?.country) {
      this.tasks.push({
        id: 'profile',
        title: 'Complete your profile',
        description: 'Add phone and country to personalize your experience',
        completed: false,
        route: '/client/settings'
      });
    }

    if (!user?.emergency_contact_name) {
      this.tasks.push({
        id: 'emergency',
        title: 'Add emergency contact',
        description: 'For your safety during tours',
        completed: false,
        route: '/client/settings'
      });
    }

    this.paymentService.listPayments().subscribe({
      next: () => {},
      error: () => {}
    });

    // Always show payment method task for new users
    this.tasks.push({
      id: 'payment',
      title: 'Add a payment method',
      description: 'Save a card for faster checkout',
      completed: false,
      route: '/client/settings'
    });
  }

  completeTask(task: Task): void {
    task.completed = true;
    if (task.route) this.router.navigate([task.route]);
  }

  removeTask(index: number): void {
    this.tasks.splice(index, 1);
  }
}
