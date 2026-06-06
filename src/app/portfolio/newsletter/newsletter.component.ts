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
  email = '';
  submitted = false;
  error = '';

  onSubscribe(event: Event): void {
    event.preventDefault();
    this.error = '';
    if (!this.email || !this.isValidEmail(this.email)) {
      this.error = 'Please enter a valid email address.';
      return;
    }
    // Optimistic confirmation — no backend endpoint needed for newsletter
    this.submitted = true;
    this.email = '';
  }

  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}
