import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Testimonial {
  id: number;
  name: string;
  location: string;
  text: string;
  rating: number;
  avatar: string;
}

@Component({
  selector: 'app-travelers-testimonials',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './travelers-testimonials.component.html',
  styleUrl: './travelers-testimonials.component.scss'
})
export class TravelersTestimonialsComponent {
  testimonials: Testimonial[] = [
    {
      id: 1,
      name: 'Sarah Johnson',
      location: 'New York, USA',
      text: 'An unforgettable experience! Our guide showed us hidden corners of Paris we never would have found on our own.',
      rating: 5,
      avatar: 'assets/images/avatar/sarah.png'
    },
    {
      id: 2,
      name: 'Marco Rossi',
      location: 'Milan, Italy',
      text: 'The food tour was incredible. We tasted authentic French cuisine and learned so much about the culture.',
      rating: 5,
      avatar: 'assets/images/avatar/marco.png'
    },
    {
      id: 3,
      name: 'Lisa Chen',
      location: 'Singapore',
      text: 'Perfect for families! Our kids loved the interactive tour and the guide was so patient and knowledgeable.',
      rating: 5,
      avatar: 'assets/images/avatar/lisa.png'
    }
  ];
}
