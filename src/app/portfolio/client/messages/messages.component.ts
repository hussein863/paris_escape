import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ClientHeaderComponent } from '../client-header/client-header.component';
import { MessagingService } from '../../../core/services/messaging.service';
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

  constructor(
    private messagingService: MessagingService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.messagingService.listConversations().subscribe({
      next: (res) => {
        this.conversations = res.results;
        const targetId = this.route.snapshot.queryParamMap.get('conversationId');
        if (targetId) {
          const target = this.conversations.find(c => c.id === +targetId);
          if (target) {
            this.selectConversation(target);
          } else if (this.conversations.length > 0) {
            this.selectConversation(this.conversations[0]);
          }
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
    this.messagingService.getConversation(conversation.id).subscribe({
      next: (full) => { this.messages = full.messages ?? []; }
    });
  }

  sendMessage(): void {
    if (!this.newMessage.trim() || !this.selectedConversation) return;
    const text = this.newMessage;
    this.newMessage = '';
    this.messagingService.sendMessage(this.selectedConversation.id, text).subscribe({
      next: (msg) => {
        this.messages.push(msg);
        if (this.selectedConversation) {
          this.selectedConversation.last_message = text;
        }
      }
    });
  }

  get filteredConversations(): Conversation[] {
    let result = this.conversations;
    if (this.searchQuery.trim()) {
      result = result.filter(c =>
        c.status.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
    return result;
  }

  get allCount(): number { return this.conversations.length; }
  get unreadCount(): number { return 0; }
}
