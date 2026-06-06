import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';
  password2 = '';
  role: 'Customer' | 'Guide' = 'Customer';
  error = '';
  loading = false;

  constructor(private auth: AuthService, private router: Router) {}

  onSubmit(): void {
    if (!this.name || !this.email || !this.password || !this.password2) return;
    if (this.password !== this.password2) {
      this.error = 'Passwords do not match.';
      return;
    }

    this.loading = true;
    this.error = '';

    this.auth.register({
      email: this.email,
      name: this.name,
      password: this.password,
      password2: this.password2,
      role: this.role
    }).subscribe({
      next: () => {
        this.auth.login(this.email, this.password).subscribe({
          next: (user) => {
            this.router.navigate(user.role === 'Guide' || user.role === 'Admin'
              ? ['/admin/dashboard']
              : ['/client/home']
            );
          },
          error: () => this.router.navigate(['/auth/login'])
        });
      },
      error: (err) => {
        const data = err.error;
        this.error = data?.email?.[0] || data?.password?.[0] || data?.detail || 'Registration failed.';
        this.loading = false;
      }
    });
  }
}
