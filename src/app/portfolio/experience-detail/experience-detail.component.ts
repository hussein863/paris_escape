import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
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

@Component({
  selector: 'app-experience-detail',
  standalone: true,
  imports: [
    CommonModule,
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
    SimilarExperiencesComponent
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

  ngOnInit(): void {
    // Component initialization
  }
}
