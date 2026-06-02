import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-experiences',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent],
  templateUrl: './experiences.component.html',
  styleUrl: './experiences.component.scss',
})
export class ExperiencesComponent {
  isSidebarOpen = false;

  constructor(private router: Router) {}

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidebar(): void {
    this.isSidebarOpen = false;
  }

  createExperience(): void {
    this.router.navigate(['/admin/experiences/create']);
  }

  experiences = [
    {
      id: 1,
      title: 'Montmartre Art & Culture Walk',
      category: 'Art & Culture',
      duration: '2.5 hours',
      status: 'Active',
      badges: ['Originals'],
      views: 124,
      bookings: 8,
      rating: 4.8,
      reviews: 15,
      price: 75,
      image: 'assets/images/584343c3e7e789860c4b423fe936db33b49f2034.png'
    },
    {
      id: 2,
      title: 'Parisian Food Market Tour',
      category: 'Food & Wine',
      duration: '3 hours',
      status: 'Active',
      badges: [],
      views: 89,
      bookings: 5,
      rating: 4.9,
      reviews: 8,
      price: 95,
      image: 'assets/images/7d06f372c468a3d2e82d705f8002d046acdc0d69.png'
    },
    {
      id: 3,
      title: 'Instagram Photography Walk',
      category: 'Photography',
      duration: '2 hours',
      status: 'Under Review',
      badges: ['Originals Pending'],
      views: 45,
      bookings: 2,
      rating: 0,
      reviews: 0,
      price: 65,
      image: 'assets/images/c1435dc9b309f4fffd428840fa4ea3067f63c271.png'
    },
    {
      id: 4,
      title: 'Evening Seine Discovery',
      category: 'Culture',
      duration: '1.5 hours',
      status: 'Draft',
      badges: [],
      views: 0,
      bookings: 0,
      rating: 0,
      reviews: 0,
      price: 45,
      image: 'assets/images/06d4deebcd0db308e4b3cac3cd3c636dafdcec78.png'
    }
  ];

  activeTab = 'all';
  searchQuery = '';
  selectedStatus = 'All Status';
  selectedCategory = 'All Categories';

  get activeCount() {
    return this.experiences.filter(e => e.status === 'Active').length;
  }

  get draftCount() {
    return this.experiences.filter(e => e.status === 'Draft').length;
  }

  get originalsCount() {
    return this.experiences.filter(e => e.badges.includes('Originals')).length;
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }
}
