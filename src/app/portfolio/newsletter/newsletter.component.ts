import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

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
  loading = false;
  error = '';

  constructor(private http: HttpClient) {}

  onSubscribe(event: Event): void {
    event.preventDefault();
    this.error = '';
    if (!this.email || !this.isValidEmail(this.email)) {
      this.error = 'Please enter a valid email address.';
      return;
    }
    this.loading = true;
    this.http.post(`${environment.apiUrl}/users/newsletter/`, { email: this.email }).subscribe({
      next: () => {
        this.loading = false;
        this.submitted = true;
        this.email = '';
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.detail ?? 'Something went wrong. Please try again.';
      }
    });
  }

  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}
