import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Guide } from '../guide-profile.component';
import { MessagingService } from '../../../core/services/messaging.service';
import { AuthService } from '../../../core/services/auth.service';
import { AuthPromptModalComponent } from '../../component/auth-prompt-modal/auth-prompt-modal.component';

@Component({
  selector: 'app-profile-sidebar',
  standalone: true,
  imports: [CommonModule, AuthPromptModalComponent],
  templateUrl: './profile-sidebar.component.html',
  styleUrl: './profile-sidebar.component.scss'
})
export class ProfileSidebarComponent {
  @Input() guide!: Guide;
  @Input() guideId: number | null = null;

  messageSending = false;
  showAuthModal = false;

  @Output() reportClicked = new EventEmitter<void>();

  constructor(
    private router: Router,
    private messagingService: MessagingService,
    private auth: AuthService,
  ) {}

  messageGuide(): void {
    if (!this.auth.isLoggedIn()) {
      this.showAuthModal = true;
      return;
    }
    const id = this.guideId;
    if (!id) return;
    this.messageSending = true;
    this.messagingService.startConversationWithGuide(id).subscribe({
      next: (conv) => {
        this.messageSending = false;
        this.router.navigate(['/client/messages'], { queryParams: { conversationId: conv.id } });
      },
      error: () => { this.messageSending = false; }
    });
  }
}
