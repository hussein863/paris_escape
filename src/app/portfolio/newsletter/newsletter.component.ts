import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-newsletter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './newsletter.component.html',
  styleUrl: './newsletter.component.scss'
})
export class NewsletterComponent {
  email: string = '';

  onSubscribe(event: Event): void {
    event.preventDefault();
    
    if (this.email && this.isValidEmail(this.email)) {
      console.log('Subscribing email:', this.email);
      // TODO: Implement actual subscription logic
      alert('Thank you for subscribing!');
      this.email = '';
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
