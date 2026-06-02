import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClientHeaderComponent } from '../client-header/client-header.component';

type MessageSender = 'user' | 'guide';

interface ChatMessage {
  id: number;
  sender: MessageSender;
  text: string;
  timestamp: string;
  divider?: string;
}

interface BookingInfo {
  title: string;
  datetime: string;
  status: 'Confirmed' | 'Pending' | 'Cancelled';
  price: number;
  bookingId: string;
  imageUrl: string;
}

interface Conversation {
  id: number;
  name: string;
  avatar: string;
  status: 'Confirmed' | 'Pending' | 'Support';
  archived?: boolean;
  badge?: string;
  preview: string;
  subline: string;
  time: string;
  unread?: boolean;
  pinned?: boolean;
  hasAttachment?: boolean;
  languages: string;
  booking: BookingInfo;
  messages: ChatMessage[];
  conversationStart: string;
}

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

  conversations: Conversation[] = [
    {
      id: 1,
      name: 'Marie Dubois',
      avatar: 'assets/images/avatar/emma.png',
      status: 'Confirmed',
      badge: 'Today',
      preview: 'Thank you for the wonderful...',
      subline: 'Louvre Masterpieces Tour · Today 10:00 AM',
      time: '2m',
      unread: true,
      pinned: true,
      hasAttachment: true,
      languages: 'Speaks French, English, Spanish',
      booking: {
        title: 'Private Louvre Masterpieces Tour',
        datetime: 'Saturday, December 14, 2024 at 10:00 AM (Local time)',
        status: 'Confirmed',
        price: 180,
        bookingId: 'PE-2024-1214-001',
        imageUrl: 'assets/images/card_image/louvre.png'
      },
      conversationStart: 'Conversation started December 13, 2024',
      messages: [
        {
          id: 1,
          sender: 'guide',
          text: 'Hello Sophie! I\'m excited to show you the Louvre tomorrow. I\'ll be waiting at the pyramid entrance with a red umbrella so you can easily spot me.',
          timestamp: 'Yesterday 6:30 PM'
        },
        {
          id: 2,
          sender: 'user',
          text: 'Perfect! Should I bring anything specific? I\'m really looking forward to learning about the masterpieces.',
          timestamp: 'Yesterday 7:15 PM'
        },
        {
          id: 3,
          sender: 'guide',
          text: 'Just comfortable walking shoes and maybe a small bag for your belongings. I\'ll provide all the historical context and fun stories!',
          timestamp: 'Yesterday 7:45 PM'
        },
        {
          id: 4,
          sender: 'guide',
          text: 'Good morning! I\'m here at the pyramid entrance with the red umbrella. See you in a few minutes!',
          timestamp: '9:58 AM',
          divider: 'Today'
        }
      ]
    },
    {
      id: 2,
      name: 'Pierre Martin',
      avatar: 'assets/images/avatar/james.png',
      status: 'Pending',
      preview: 'Thank you for the wonderful...',
      subline: 'Montmartre Walk · Dec 22, 2:00 PM',
      time: '1h',
      unread: true,
      pinned: true,
      hasAttachment: true,
      languages: 'Speaks French, English',
      booking: {
        title: 'Montmartre Artists\' Quarter Walk',
        datetime: 'Sunday, December 22, 2024 at 2:00 PM (Local time)',
        status: 'Pending',
        price: 65,
        bookingId: 'PE-2024-1222-002',
        imageUrl: 'assets/images/card_image/montmartre.png'
      },
      conversationStart: 'Conversation started December 10, 2024',
      messages: [
        {
          id: 1,
          sender: 'guide',
          text: 'Hi Sophie! I received your request and will confirm within the next 24 hours.',
          timestamp: 'Yesterday 5:10 PM'
        }
      ]
    },
    {
      id: 3,
      name: 'Support Team',
      avatar: 'assets/images/avatar/sarah.png',
      status: 'Support',
      preview: 'Thank you for the wonderful...',
      subline: 'Support · Ticket #2481',
      time: '3h',
      unread: true,
      languages: 'Support desk',
      booking: {
        title: 'Account Support',
        datetime: 'We are reviewing your request',
        status: 'Confirmed',
        price: 0,
        bookingId: 'SUP-2481',
        imageUrl: 'assets/images/avatar/sarah.png'
      },
      conversationStart: 'Conversation started December 5, 2024',
      messages: [
        {
          id: 1,
          sender: 'guide',
          text: 'Thanks for reaching out. Our team is reviewing your request and will reply shortly.',
          timestamp: 'Yesterday 2:10 PM'
        }
      ]
    },
    {
      id: 4,
      name: 'Camille Rousseau',
      avatar: 'assets/images/avatar/lisa.png',
      status: 'Confirmed',
      preview: 'Thank you for the wonderful...',
      subline: 'Seine Cruise · Dec 10',
      time: '2d',
      pinned: true,
      hasAttachment: true,
      languages: 'Speaks French, English',
      booking: {
        title: 'Seine Sunset Cruise',
        datetime: 'Tuesday, December 10, 2024 at 6:30 PM (Local time)',
        status: 'Confirmed',
        price: 45,
        bookingId: 'PE-2024-1210-003',
        imageUrl: 'assets/images/card_image/seine-sunset.png'
      },
      conversationStart: 'Conversation started December 1, 2024',
      messages: [
        {
          id: 1,
          sender: 'guide',
          text: 'Thanks again for joining the sunset cruise!',
          timestamp: 'Dec 10, 8:30 PM'
        }
      ]
    },
    {
      id: 5,
      name: 'Antoine Leroy',
      avatar: 'assets/images/avatar/michael.png',
      status: 'Confirmed',
      preview: 'Thank you for the wonderful...',
      subline: 'Literary Walk · Dec 8',
      time: '1w',
      pinned: true,
      hasAttachment: true,
      languages: 'Speaks French, English',
      booking: {
        title: 'Latin Quarter Literary Walk',
        datetime: 'Sunday, December 8, 2024 at 11:00 AM (Local time)',
        status: 'Confirmed',
        price: 35,
        bookingId: 'PE-2024-1208-010',
        imageUrl: 'assets/images/card_image/latin-quarter.png'
      },
      conversationStart: 'Conversation started November 30, 2024',
      messages: [
        {
          id: 1,
          sender: 'guide',
          text: 'It was a pleasure guiding you through the Latin Quarter.',
          timestamp: 'Dec 8, 2:15 PM'
        }
      ]
    }
  ];

  quickReplies = [
    'I\'m running late',
    'Where exactly are you?',
    'Change meeting time'
  ];

  ngOnInit(): void {
    this.selectedConversation = this.conversations[0] ?? null;
  }

  setFilter(filter: 'All' | 'Unread' | 'Archived'): void {
    this.activeFilter = filter;
  }

  selectConversation(conversation: Conversation): void {
    this.selectedConversation = conversation;
    conversation.unread = false;
  }

  get filteredConversations(): Conversation[] {
    let result = this.conversations;

    if (this.activeFilter === 'Unread') {
      result = result.filter((conversation) => conversation.unread);
    }

    if (this.activeFilter === 'Archived') {
      result = result.filter((conversation) => conversation.archived);
    }

    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      result = result.filter((conversation) =>
        conversation.name.toLowerCase().includes(query)
      );
    }

    return result;
  }

  get allCount(): number {
    return this.conversations.length;
  }

  get unreadCount(): number {
    return this.conversations.filter((conversation) => conversation.unread).length;
  }

  sendMessage(): void {
    if (!this.newMessage.trim() || !this.selectedConversation) {
      return;
    }

    this.selectedConversation.messages.push({
      id: this.selectedConversation.messages.length + 1,
      sender: 'user',
      text: this.newMessage,
      timestamp: 'Just now'
    });

    this.newMessage = '';
  }
}
