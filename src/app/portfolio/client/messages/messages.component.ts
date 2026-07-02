import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MessagingService } from '../../../core/services/messaging.service';
import { AuthService } from '../../../core/services/auth.service';
import { IdEncryptService } from '../../../core/services/id-encrypt.service';
import { BookingService } from '../../../core/services/booking.service';
import { Conversation, Message, Booking } from '../../../core/models';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-client-messages',
  standalone: true,
  imports: [CommonModule, FormsModule],
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

  openMenuId: number | null = null;

  showReportModal = false;
  reportConversationRef: Conversation | null = null;
  reportReason = '';
  reportDescription = '';
  reportSubmitting = false;
  reportFeedback = '';
  reportFeedbackType: 'success' | 'error' = 'success';

  private pollInterval: any;

  constructor(
    private messagingService: MessagingService,
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthService,
    private idEncrypt: IdEncryptService,
    private bookingService: BookingService,
    private http: HttpClient,
  ) {}

  @HostListener('document:click')
  onDocumentClick(): void {
    this.openMenuId = null;
  }

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
    if (this.activeFilter === 'All') result = result.filter(c => !c.is_archived);
    else if (this.activeFilter === 'Unread') result = result.filter(c => c.is_unread && !c.is_archived);
    else if (this.activeFilter === 'Archived') result = result.filter(c => c.is_archived === true);
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

  get allCount(): number { return this.conversations.filter(c => !c.is_archived).length; }
  get unreadCount(): number { return this.conversations.filter(c => c.is_unread && !c.is_archived).length; }

  toggleMoreMenu(conversationId: number, event: Event): void {
    event.stopPropagation();
    this.openMenuId = this.openMenuId === conversationId ? null : conversationId;
  }

  toggleArchive(conversation: Conversation, event: Event): void {
    event.stopPropagation();
    this.openMenuId = null;
    const newState = !conversation.is_archived;
    conversation.is_archived = newState;
    this.http.patch(`${environment.apiUrl}/messages/conversations/${conversation.id}/`, { is_archived: newState })
      .subscribe({ error: () => { conversation.is_archived = !newState; } });
  }

  isArchived(conversation: Conversation): boolean {
    return conversation.is_archived === true;
  }

  toggleUnread(conversation: Conversation, event: Event): void {
    event.stopPropagation();
    this.openMenuId = null;
    conversation.is_unread = !conversation.is_unread;
  }

  openReportModal(conversation: Conversation, event: Event): void {
    event.stopPropagation();
    this.openMenuId = null;
    this.reportConversationRef = conversation;
    this.reportReason = '';
    this.reportDescription = '';
    this.reportFeedback = '';
    this.showReportModal = true;
  }

  closeReportModal(): void {
    this.showReportModal = false;
    this.reportConversationRef = null;
  }

  submitReport(): void {
    if (!this.reportReason || !this.reportConversationRef) return;
    this.reportSubmitting = true;
    this.http.post(`${environment.apiUrl}/reviews/reports/`, {
      report_type: 'conversation',
      conversation: this.reportConversationRef.id,
      reason: this.reportReason,
      description: this.reportDescription,
    }).subscribe({
      next: () => {
        this.reportFeedback = 'Report submitted. Our team will review it.';
        this.reportFeedbackType = 'success';
        this.reportSubmitting = false;
        if (this.reportConversationRef) this.reportConversationRef.is_reported = true;
        setTimeout(() => this.closeReportModal(), 1800);
      },
      error: () => {
        this.reportFeedback = 'Failed to submit report. Please try again.';
        this.reportFeedbackType = 'error';
        this.reportSubmitting = false;
      }
    });
  }

  onAvatarError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
  }
}
