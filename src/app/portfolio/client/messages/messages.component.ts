import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ClientHeaderComponent } from '../client-header/client-header.component';
import { MessagingService } from '../../../core/services/messaging.service';
import { AuthService } from '../../../core/services/auth.service';
import { Conversation, Message } from '../../../core/models';

@Component({
  selector: 'app-client-messages',
  standalone: true,
  imports: [CommonModule, FormsModule, ClientHeaderComponent],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.scss'
})
export class ClientMessagesComponent implements OnInit {
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

  constructor(
    private messagingService: MessagingService,
    private route: ActivatedRoute,
    private auth: AuthService,
  ) {}

  private loadCurrentUserInfo(): void {
    const user = this.auth.user();
    if (user) {
      this.currentUserName = user.name || 'You';
      this.currentUserAvatar = user.avatar || '';
    }
  }

  ngOnInit(): void {
    this.loadCurrentUserInfo();
    this.loading = true;
    this.messagingService.listConversations().subscribe({
      next: (res) => {
        this.conversations = res.results;
        const conversationId = this.route.snapshot.queryParamMap.get('conversationId');
        const guideId = this.route.snapshot.queryParamMap.get('guideId');
        let target: Conversation | undefined;
        if (conversationId) {
          target = this.conversations.find(c => c.id === +conversationId);
        } else if (guideId) {
          target = this.conversations.find(c => c.guide === +guideId);
        }
        if (target) {
          this.selectConversation(target);
        } else if (this.conversations.length > 0) {
          this.selectConversation(this.conversations[0]);
        }
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  setFilter(filter: 'All' | 'Unread' | 'Archived'): void {
    this.activeFilter = filter;
  }

  selectConversation(conversation: Conversation): void {
    this.selectedConversation = conversation;
    console.log('Loading conversation ID:', conversation.id, 'Type:', typeof conversation.id);
    this.messagingService.getConversation(conversation.id).subscribe({
      next: (full) => { this.messages = full.messages ?? []; },
      error: (err) => console.error('Failed to load conversation:', conversation.id, err)
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
        this.messages.push(msg);
        if (this.selectedConversation) {
          this.selectedConversation.last_message = text;
        }
        this.sendingMessage = false;
      },
      error: (err) => {
        this.messageError = 'Failed to send message. Please try again.';
        this.newMessage = text;
        this.sendingMessage = false;
        console.error('Failed to send message:', err);
      }
    });
  }

  get filteredConversations(): Conversation[] {
    let result = this.conversations;

    // Filter by active tab
    if (this.activeFilter === 'Unread') {
      result = result.filter(c => c.is_unread);
    } else if (this.activeFilter === 'Archived') {
      result = result.filter(c => c.is_archived);
    }

    // Filter by search query
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      result = result.filter(c =>
        (c.guide_name || '').toLowerCase().includes(q) ||
        c.status.toLowerCase().includes(q) ||
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
