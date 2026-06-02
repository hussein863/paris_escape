import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientHeaderComponent } from '../client-header/client-header.component';

type ReservationTab = 'upcoming' | 'past' | 'cancelled' | 'disputes';

interface Reservation {
  title: string;
  date: string;
  time: string;
  timeZone: string;
  badge?: string;
  guide: string;
  guideAvatar: string;
  location: string;
  cancellation: string;
  status: 'Confirmed' | 'Pending' | 'Cancelled' | 'Disputed';
  price: number;
  bookingId: string;
  imageUrl: string;
  tab: ReservationTab;
}

interface ViewedItem {
  title: string;
  price: number;
  duration: string;
  imageUrl: string;
}

@Component({
  selector: 'app-client-reservations',
  standalone: true,
  imports: [CommonModule, ClientHeaderComponent],
  templateUrl: './reservations.component.html',
  styleUrl: './reservations.component.scss'
})
export class ClientReservationsComponent {
  activeTab: ReservationTab = 'upcoming';

  tabs: { key: ReservationTab; label: string; count: number }[] = [
    { key: 'upcoming', label: 'Upcoming', count: 2 },
    { key: 'past', label: 'Past', count: 8 },
    { key: 'cancelled', label: 'Cancelled', count: 1 },
    { key: 'disputes', label: 'Disputes', count: 0 }
  ];

  reservations: Reservation[] = [
    {
      title: 'Private Louvre Masterpieces Tour',
      date: 'Saturday, December 14, 2024',
      time: '10:00 AM',
      timeZone: 'Local time',
      badge: 'Today',
      guide: 'Marie Dubois',
      guideAvatar: 'assets/images/avatar/emma.png',
      location: 'Louvre Pyramid, 99 Rue de Rivoli, 1st arrondissement',
      cancellation: 'Free cancellation until 24h before',
      status: 'Confirmed',
      price: 180,
      bookingId: 'PE-2024-1214-001',
      imageUrl: 'assets/images/card_image/louvre.png',
      tab: 'upcoming'
    },
    {
      title: "Montmartre Artists' Quarter Walk",
      date: 'Sunday, December 22, 2024',
      time: '2:00 PM',
      timeZone: 'Local time',
      guide: 'Pierre Martin',
      guideAvatar: 'assets/images/avatar/james.png',
      location: 'Place du Tertre, Montmartre, 18th arrondissement',
      cancellation: 'Free cancellation until 48h before',
      status: 'Pending',
      price: 65,
      bookingId: 'PE-2024-1222-002',
      imageUrl: 'assets/images/card_image/montmartre.png',
      tab: 'upcoming'
    },
    {
      title: 'Seine Sunset Cruise',
      date: 'Saturday, November 9, 2024',
      time: '6:30 PM',
      timeZone: 'Local time',
      guide: 'Isabelle Rousseau',
      guideAvatar: 'assets/images/avatar/lisa.png',
      location: 'Port de la Bourdonnais, 7th arrondissement',
      cancellation: 'Non-refundable booking',
      status: 'Confirmed',
      price: 45,
      bookingId: 'PE-2024-1109-018',
      imageUrl: 'assets/images/card_image/seine-sunset.png',
      tab: 'past'
    },
    {
      title: 'Versailles Palace & Gardens',
      date: 'Friday, October 4, 2024',
      time: '9:30 AM',
      timeZone: 'Local time',
      guide: 'Camille Bernard',
      guideAvatar: 'assets/images/avatar/emma.png',
      location: "Versailles Palace, Place d'Armes, Versailles",
      cancellation: 'Cancelled by guest',
      status: 'Cancelled',
      price: 120,
      bookingId: 'PE-2024-1004-004',
      imageUrl: 'assets/images/card_image/seine.png',
      tab: 'cancelled'
    }
  ];

  recentlyViewed: ViewedItem[] = [
    {
      title: 'Seine Sunset Cruise',
      price: 45,
      duration: '2h',
      imageUrl: 'assets/images/card_image/seine-sunset.png'
    },
    {
      title: 'Latin Quarter Literary Walk',
      price: 35,
      duration: '2h',
      imageUrl: 'assets/images/card_image/latin-quarter.png'
    },
    {
      title: 'French Pastry Workshop',
      price: 95,
      duration: '3h',
      imageUrl: 'assets/images/card_image/pastry-workshop.png'
    }
  ];

  setActiveTab(tab: ReservationTab): void {
    this.activeTab = tab;
  }

  get filteredReservations(): Reservation[] {
    return this.reservations.filter((reservation) => reservation.tab === this.activeTab);
  }
}
