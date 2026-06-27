import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth-prompt-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './auth-prompt-modal.component.html',
  styleUrl: './auth-prompt-modal.component.scss'
})
export class AuthPromptModalComponent {
  @Input() visible = false;
  @Input() action = 'continue';
  @Output() closed = new EventEmitter<void>();

  constructor(private router: Router) {}

  @HostListener('document:keydown.escape')
  close(): void {
    this.closed.emit();
  }

  goToLogin(): void {
    this.close();
    this.router.navigate(['/auth/login'], { queryParams: { returnUrl: this.router.url } });
  }

  goToRegister(): void {
    this.close();
    this.router.navigate(['/auth/register'], { queryParams: { returnUrl: this.router.url } });
  }
}
