import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { AdminHeaderComponent } from '../header/admin-header.component';
import { MessagingService } from '../../core/services/messaging.service';
import { Conversation as ApiConversation, Message as ApiMessage } from '../../core/models';
import { environment } from '../../../environments/environment';

interface Message {
  id: number;
  sender: 'user' | 'guide';
  text: string;
  timestamp: string;
}

interface Conversation {
  id: number;
  customerId: number;
  name: string;
  avatar: string;
  guide_name?: string;
  guide_avatar?: string;
  lastMessage: string;
  timestamp: string;
  status: 'Confirmed' | 'Pending' | 'Pre-contact' | 'Open';
  tourName: string;
  tourImage?: string;
  experiencePrice?: number | null;
  experienceDuration?: string | null;
  experienceId?: number | null;
  unread: boolean;
  flagged?: boolean;
  archived?: boolean;
}

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent, AdminHeaderComponent],
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit, OnDestroy {
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
  openMenuId: number | null = null;
  private pollInterval: any;

  constructor(private messagingService: MessagingService) {}

  ngOnInit(): void {
    this.loadConversations();
    this.pollInterval = setInterval(() => this.silentRefresh(), 10000);
  }

  ngOnDestroy(): void {
    clearInterval(this.pollInterval);
  }

  private silentRefresh(): void {
    this.messagingService.listConversations().subscribe({
      next: (res) => {
        const selectedId = this.selectedConversation?.id;
        this.conversations = res.results.map((c: ApiConversation) => ({
          id: c.id,
          customerId: c.customer,
          name: c.customer_name || `Customer #${c.customer}`,
          avatar: c.customer_avatar || 'assets/images/ec901f1c0d6bdc3abb3b7f2578c96a444ee001e2.jpg',
          guide_name: c.guide_name,
          guide_avatar: c.guide_avatar,
          lastMessage: c.last_message,
          timestamp: new Date(c.last_message_at).toLocaleDateString(),
          status: c.status as any,
          tourName: c.experience_title || '',
          tourImage: c.experience_image || '',
          experiencePrice: c.experience_price,
          experienceDuration: c.experience_duration,
          experienceId: c.experience_id,
          unread: c.is_unread || false,
          flagged: c.is_flagged || false,
          archived: c.is_archived || false
        }));
        if (selectedId) {
          const updated = this.conversations.find(c => c.id === selectedId);
          if (updated) this.selectedConversation = { ...this.selectedConversation!, ...updated };
        }
      },
      error: () => {}
    });
  }

  loadConversations(): void {
    this.loading = true;
    this.messagingService.listConversations().subscribe({
      next: (res) => {
        this.conversations = res.results.map((c: ApiConversation) => ({
          id: c.id,
          customerId: c.customer,
          name: c.customer_name || `Customer #${c.customer}`,
          avatar: c.customer_avatar || 'assets/images/ec901f1c0d6bdc3abb3b7f2578c96a444ee001e2.jpg',
          guide_name: c.guide_name,
          guide_avatar: c.guide_avatar,
          lastMessage: c.last_message,
          timestamp: new Date(c.last_message_at).toLocaleDateString(),
          status: c.status as any,
          tourName: c.experience_title || '',
          tourImage: c.experience_image || '',
          experiencePrice: c.experience_price,
          experienceDuration: c.experience_duration,
          experienceId: c.experience_id,
          unread: c.is_unread || false,
          flagged: c.is_flagged || false,
          archived: c.is_archived || false
        })).sort((a, b) => {
          // Unread conversations first, then by timestamp
          if (a.unread && !b.unread) return -1;
          if (!a.unread && b.unread) return 1;
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
        });
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
        // Update guide avatar from API response
        if (this.selectedConversation) {
          this.selectedConversation.guide_avatar = c.guide_avatar;
        }
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
      },
      error: (err) => {
        console.error('Failed to send message:', err);
        this.newMessage = text; // Restore message on error
        alert('Failed to send message. Please try again.');
      }
    });
  }

  toggleSidebar(): void { this.isSidebarOpen = !this.isSidebarOpen; }
  closeSidebar(): void { this.isSidebarOpen = false; }
  setFilter(filter: string): void { this.activeFilter = filter; }

  onSearchChange(): void {
    if (!this.searchQuery.trim()) {
      this.loadConversations();
    }
  }

  toggleMoreMenu(conversationId: number, event: Event): void {
    event.stopPropagation();
    this.openMenuId = this.openMenuId === conversationId ? null : conversationId;
  }

  openConversationInfo(): void {
    alert(`Conversation with ${this.selectedConversation?.name}\nStatus: ${this.selectedConversation?.status}`);
  }

  insertQuickAction(action: string): void {
    const templates: { [key: string]: string } = {
      'Greeting': 'Hello! Thank you for booking with us. Looking forward to seeing you soon!',
      'Meeting Point': 'Please meet us at the meeting point at the scheduled time.',
      'Schedule Change': 'There has been a change to the schedule. Please check your email for details.',
      'Refund': 'Your refund has been processed. It should appear in your account within 3-5 business days.'
    };
    this.newMessage = templates[action] || '';
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      const fileSize = (file.size / (1024 * 1024)).toFixed(2);
      this.newMessage += `\n📎 File: ${file.name} (${fileSize}MB)`;
      // Reset input
      input.value = '';
    }
  }

  openAddContact(): void {
    const guideName = prompt('Enter guide name to contact:');
    if (!guideName) return;

    // Create a new conversation
    const newConversation: Conversation = {
      id: Date.now(),
      customerId: 0,
      name: guideName,
      avatar: 'assets/images/ec901f1c0d6bdc3abb3b7f2578c96a444ee001e2.jpg',
      lastMessage: 'Conversation started',
      timestamp: new Date().toLocaleDateString(),
      status: 'Open',
      tourName: '',
      unread: false
    };

    this.conversations.unshift(newConversation);
    this.selectConversation(newConversation);
    alert(`New conversation started with ${guideName}!`);
  }

  openSafetyInfo(): void {
    alert('Paris Escape monitors all messages to ensure safety and security of our community.');
  }

  openContactQuotaInfo(): void {
    alert('Contact Quota: You have a limited number of contacts you can reach out to each month. Learn more about how to increase your quota.');
  }

  toggleArchive(conversation: Conversation, event: Event): void {
    event.stopPropagation();
    (conversation as any).is_archived = !(conversation as any).is_archived;
    this.openMenuId = null;
  }

  toggleFlag(conversation: Conversation, event: Event): void {
    event.stopPropagation();
    (conversation as any).is_flagged = !(conversation as any).is_flagged;
    this.openMenuId = null;
  }

  isFlagged(conversation: Conversation): boolean {
    return (conversation as any).is_flagged || false;
  }

  isArchived(conversation: Conversation): boolean {
    return (conversation as any).is_archived || false;
  }

  toggleUnread(conversation: Conversation, event: Event): void {
    event.stopPropagation();
    conversation.unread = !conversation.unread;
    this.openMenuId = null;
    // Re-sort conversations to move unread to top
    this.conversations.sort((a, b) => {
      if (a.unread && !b.unread) return -1;
      if (!a.unread && b.unread) return 1;
      return 0;
    });
  }

  deleteConversation(conversation: Conversation, event: Event): void {
    event.stopPropagation();
    if (confirm(`Delete conversation with ${conversation.name}?`)) {
      this.conversations = this.conversations.filter(c => c.id !== conversation.id);
      if (this.selectedConversation?.id === conversation.id) {
        this.selectedConversation = null;
      }
      this.openMenuId = null;
    }
  }

  get quotaPercentage(): number {
    return (this.contactQuota.used / this.contactQuota.total) * 100;
  }

  get filteredConversations(): Conversation[] {
    return this.conversations.filter(c => {
      // Apply filter
      let matchesFilter = false;
      if (this.activeFilter === 'All') {
        matchesFilter = true;
      } else if (this.activeFilter === 'Unread') {
        matchesFilter = c.unread === true;
      } else if (this.activeFilter === 'Archived') {
        matchesFilter = (c as any).is_archived === true;
      } else if (this.activeFilter === 'Flagged') {
        matchesFilter = (c as any).is_flagged === true;
      } else {
        matchesFilter = c.status === this.activeFilter;
      }

      // Apply search
      const matchesSearch = !this.searchQuery || (
        c.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        c.lastMessage.toLowerCase().includes(this.searchQuery.toLowerCase())
      );

      return matchesFilter && matchesSearch;
    });
  }

  getUnreadCount(): number {
    return this.conversations.filter(c => c.unread).length;
  }

  onAvatarError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
  }
}
