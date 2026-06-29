import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MessagingService } from '../../../../core/services/messaging.service';
import { AuthService } from '../../../../core/services/auth.service';
import { IdEncryptService } from '../../../../core/services/id-encrypt.service';

interface Guide {
  name: string;
  avatar: string;
  rating: number;
  reviewsCount: number;
  languages: string[];
  bio: string;
}

@Component({
  selector: 'app-guide-profile',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './guide-profile.component.html',
  styleUrl: './guide-profile.component.scss'
})
export class GuideProfileComponent {
  @Input() guide: Guide = { name: '', avatar: '', rating: 0, reviewsCount: 0, languages: [], bio: '' };
  @Input() guideId: number | null = null;
  messageSending = false;

  constructor(
    private router: Router,
    private messagingService: MessagingService,
    private auth: AuthService,
    private idEncrypt: IdEncryptService,
  ) {}

  get encryptedGuideId(): string | null {
    return this.guideId ? this.idEncrypt.encryptId(this.guideId) : null;
  }

  messageGuide(): void {
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/auth/login']);
      return;
    }
    if (!this.guideId) return;
    this.messageSending = true;
    this.messagingService.startConversationWithGuide(this.guideId).subscribe({
      next: (conv) => {
        this.messageSending = false;
        this.router.navigate(['/client/messages'], { queryParams: { conversationId: conv.id } });
      },
      error: () => { this.messageSending = false; }
    });
  }
}
