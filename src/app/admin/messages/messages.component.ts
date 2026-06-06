import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { AdminHeaderComponent } from '../header/admin-header.component';
import { MessagingService } from '../../core/services/messaging.service';
import { Conversation as ApiConversation, Message as ApiMessage } from '../../core/models';

interface Message {
  id: number;
  sender: 'user' | 'guide';
  text: string;
  timestamp: string;
}

interface Conversation {
  id: number;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  status: 'Confirmed' | 'Pending' | 'Pre-contact' | 'Open';
  tourName: string;
  unread?: boolean;
}

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent, AdminHeaderComponent],
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {
  isSidebarOpen = false;
  contactQuota = { used: 0, total: 50 };
  searchQuery = '';
  activeFilter = 'All';
  selectedConversation: Conversation | null = null;
  newMessage = '';
  conversations: Conversation[] = [];
  messages: Message[] = [];
  bookingInfo: any = null;
  loading = false;

  constructor(private messagingService: MessagingService) {}

  ngOnInit(): void {
    this.loadConversations();
  }

  loadConversations(): void {
    this.loading = true;
    this.messagingService.listConversations().subscribe({
      next: (res) => {
        this.conversations = res.results.map((c: ApiConversation) => ({
          id: c.id,
          name: `User #${c.customer}`,
          avatar: 'assets/images/ec901f1c0d6bdc3abb3b7f2578c96a444ee001e2.jpg',
          lastMessage: c.last_message,
          timestamp: new Date(c.last_message_at).toLocaleDateString(),
          status: c.status as any,
          tourName: '',
          unread: false
        }));
        this.contactQuota.used = res.count;
        if (this.conversations.length > 0) {
          this.selectConversation(this.conversations[0]);
        }
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  selectConversation(conversation: Conversation): void {
    this.selectedConversation = conversation;
    conversation.unread = false;
    this.messagingService.getConversation(conversation.id).subscribe({
      next: (c: ApiConversation) => {
        this.messages = (c.messages || []).map((m: ApiMessage) => ({
          id: m.id,
          sender: m.sender_type === 'Guide' ? 'guide' : 'user',
          text: m.text,
          timestamp: new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }));
      }
    });
  }

  sendMessage(): void {
    if (!this.newMessage.trim() || !this.selectedConversation) return;
    const text = this.newMessage;
    this.newMessage = '';
    this.messagingService.sendMessage(this.selectedConversation.id, text).subscribe({
      next: (m: ApiMessage) => {
        this.messages.push({
          id: m.id,
          sender: 'guide',
          text: m.text,
          timestamp: 'Just now'
        });
        if (this.selectedConversation) {
          this.selectedConversation.lastMessage = text;
        }
      }
    });
  }

  toggleSidebar(): void { this.isSidebarOpen = !this.isSidebarOpen; }
  closeSidebar(): void { this.isSidebarOpen = false; }
  setFilter(filter: string): void { this.activeFilter = filter; }

  get quotaPercentage(): number {
    return (this.contactQuota.used / this.contactQuota.total) * 100;
  }

  get filteredConversations(): Conversation[] {
    return this.conversations.filter(c => {
      const matchesFilter = this.activeFilter === 'All' || c.status === this.activeFilter;
      const matchesSearch = !this.searchQuery ||
        c.name.toLowerCase().includes(this.searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }
}
