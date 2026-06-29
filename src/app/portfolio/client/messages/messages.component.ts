import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientHeaderComponent } from '../client-header/client-header.component';
import { MessagingService } from '../../../core/services/messaging.service';
import { AuthService } from '../../../core/services/auth.service';
import { IdEncryptService } from '../../../core/services/id-encrypt.service';
import { BookingService } from '../../../core/services/booking.service';
import { Conversation, Message, Booking } from '../../../core/models';

@Component({
  selector: 'app-client-messages',
  standalone: true,
  imports: [CommonModule, FormsModule, ClientHeaderComponent],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.scss'
})
export class ClientMessagesComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('messagesArea') messagesArea!: ElementRef;

  searchQuery = '';
  activeFilter: 'All' | 'Unread' | 'Archived' = 'All';
  newMessage = '';
  selectedConversation: Conversation | null = null;
  conversations: Conversation[] = [];
  messages: Message[] = [];
  loading = false;
  sendingMessage = false;
  messageError = '';
  currentUserAvatar = '';
  currentUserName = '';
  activeBooking: Booking | null = null;

  private pollInterval: any;

  constructor(
    private messagingService: MessagingService,
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthService,
    private idEncrypt: IdEncryptService,
    private bookingService: BookingService,
  ) {}

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  ngOnDestroy(): void {
    clearInterval(this.pollInterval);
  }

  private scrollToBottom(): void {
    try {
      if (this.messagesArea) {
        this.messagesArea.nativeElement.scrollTop = this.messagesArea.nativeElement.scrollHeight;
      }
    } catch {}
  }

  private loadCurrentUserInfo(): void {
    const user = this.auth.user();
    if (user) {
      this.currentUserName = user.name || 'You';
      this.currentUserAvatar = user.avatar_url || user.avatar || '';
    }
  }

  ngOnInit(): void {
    this.loadCurrentUserInfo();
    this.loading = true;

    this.messagingService.listConversations().subscribe({
      next: (res) => {
        this.conversations = res.results;
        this.loading = false;

        const experienceId = this.route.snapshot.queryParamMap.get('experienceId');
        const conversationId = this.route.snapshot.queryParamMap.get('conversationId');
        const guideId = this.route.snapshot.queryParamMap.get('guideId');
        const bookingId = this.route.snapshot.queryParamMap.get('bookingId');

        if (bookingId) {
          this.bookingService.get(+bookingId).subscribe({
            next: (booking) => { this.activeBooking = booking; },
            error: () => {}
          });
        }

        if (experienceId) {
          const existing = this.conversations.find(
            c => c.experience_id === +experienceId || c.experience === +experienceId
          );
          if (existing) {
            this.selectConversation(existing);
          } else {
            this.messagingService.startConversationForExperience(+experienceId).subscribe({
              next: (conv) => {
                this.conversations.unshift(conv);
                this.selectConversation(conv);
              },
              error: () => { this.messageError = 'Could not start conversation.'; }
            });
          }
        } else if (conversationId) {
          const target = this.conversations.find(c => c.id === +conversationId);
          if (target) this.selectConversation(target);
        } else if (guideId) {
          const target = this.conversations.find(c => c.guide === +guideId);
          if (target) {
            this.selectConversation(target);
          }
        } else if (this.conversations.length > 0) {
          this.selectConversation(this.conversations[0]);
        }

        // Start polling for real-time updates
        this.pollInterval = setInterval(() => this.silentRefresh(), 10000);
      },
      error: () => { this.loading = false; }
    });
  }

  private silentRefresh(): void {
    this.messagingService.listConversations().subscribe({
      next: (res) => {
        this.conversations = res.results;
        if (this.selectedConversation) {
          // Refresh messages for the active conversation
          this.messagingService.getConversation(this.selectedConversation.id).subscribe({
            next: (full) => {
              const newCount = (full.messages ?? []).length;
              if (newCount !== this.messages.length) {
                this.messages = full.messages ?? [];
              }
            },
            error: () => {}
          });
        }
      },
      error: () => {}
    });
  }

  setFilter(filter: 'All' | 'Unread' | 'Archived'): void {
    this.activeFilter = filter;
  }

  selectConversation(conversation: Conversation): void {
    this.selectedConversation = conversation;
    conversation.is_unread = false;
    this.messages = [];
    this.messagingService.markAsRead(conversation.id).subscribe({ error: () => {} });
    this.messagingService.getConversation(conversation.id).subscribe({
      next: (full) => {
        this.messages = full.messages ?? [];
        const idx = this.conversations.findIndex(c => c.id === full.id);
        if (idx !== -1) this.conversations[idx] = { ...this.conversations[idx], ...full };
        this.selectedConversation = { ...conversation, ...full };
      },
      error: (err) => console.error('Failed to load conversation:', err)
    });
  }

  sendMessage(): void {
    if (!this.newMessage.trim() || !this.selectedConversation) return;
    const text = this.newMessage;
    this.newMessage = '';
    this.sendingMessage = true;
    this.messageError = '';

    this.messagingService.sendMessage(this.selectedConversation.id, text).subscribe({
      next: (msg) => {
        this.messages = [...this.messages, msg];
        if (this.selectedConversation) {
          this.selectedConversation.last_message = text;
          this.selectedConversation.is_unread = false;
          // Sending a message implicitly marks it read for the sender
          this.messagingService.markAsRead(this.selectedConversation.id).subscribe({ error: () => {} });
        }
        this.sendingMessage = false;
      },
      error: () => {
        this.messageError = 'Failed to send message. Please try again.';
        this.newMessage = text;
        this.sendingMessage = false;
      }
    });
  }

  bookExperience(): void {
    if (!this.selectedConversation?.experience_id) return;
    const encId = this.idEncrypt.encryptId(this.selectedConversation.experience_id);
    this.router.navigate(['/landing/experience', encId]);
  }

  viewReservation(): void {
    this.router.navigate(['/client/reservations']);
  }

  get contextStatus(): string {
    const conv = this.selectedConversation;
    if (!conv) return '';
    if (this.activeBooking) return this.activeBooking.status;
    return 'Pre-inquiry';
  }

  get filteredConversations(): Conversation[] {
    let result = this.conversations;
    if (this.activeFilter === 'Unread') result = result.filter(c => c.is_unread);
    else if (this.activeFilter === 'Archived') result = result.filter(c => c.is_archived);
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      result = result.filter(c =>
        (c.experience_title || '').toLowerCase().includes(q) ||
        (c.guide_name || '').toLowerCase().includes(q) ||
        (c.last_message || '').toLowerCase().includes(q)
      );
    }
    return result;
  }

  get allCount(): number { return this.conversations.length; }
  get unreadCount(): number { return this.conversations.filter(c => c.is_unread).length; }

  onAvatarError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
  }
}
