import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Step {
  id: number;
  title: string;
  description: string;
  iconSize: number;
}

@Component({
  selector: 'app-how-it-works',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './how-it-works.component.html',
  styleUrl: './how-it-works.component.scss'
})
export class HowItWorksComponent {
  steps: Step[] = [
    {
      id: 1,
      title: 'Search',
      description: 'Browse experiences and find the perfect guide for your interests',
      iconSize: 24
    },
    {
      id: 2,
      title: 'Book',
      description: 'Reserve your spot instantly with secure payment and confirmation',
      iconSize: 24
    },
    {
      id: 3,
      title: 'Explore',
      description: 'Meet your guide and discover Paris through local eyes',
      iconSize: 24
    }
  ];
}
