import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../sidebar/sidebar.component';

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
  imports: [CommonModule, FormsModule, SidebarComponent],
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {
  isSidebarOpen = false;
  contactQuota = { used: 12, total: 50 };
  searchQuery = '';
  activeFilter = 'All';
  selectedConversation: Conversation | null = null;
  newMessage = '';

  conversations: Conversation[] = [
    {
      id: 1,
      name: 'Sophie Martin',
      avatar: 'assets/images/ec901f1c0d6bdc3abb3b7f2578c96a444ee001e2.jpg',
      lastMessage: 'Thank you! Looking forward to the tour tomor...',
      timestamp: '2h',
      status: 'Confirmed',
      tourName: 'Montmartre Art Walk',
      unread: true
    },
    {
      id: 2,
      name: 'James Wilson',
      avatar: 'assets/images/ec901f1c0d6bdc3abb3b7f2578c96a444ee001e2.jpg',
      lastMessage: 'Hi! I have a question about dietary restrictions',
      timestamp: '5h',
      status: 'Pending',
      tourName: 'Food Market Tour'
    },
    {
      id: 3,
      name: 'Maria Garcia',
      avatar: 'assets/images/ec901f1c0d6bdc3abb3b7f2578c96a444ee001e2.jpg',
      lastMessage: 'Perfect! See you at the meeting point.',
      timestamp: '1d',
      status: 'Confirmed',
      tourName: 'Photography Walk'
    },
    {
      id: 4,
      name: 'Thomas Dubois',
      avatar: 'assets/images/ec901f1c0d6bdc3abb3b7f2578c96a444ee001e2.jpg',
      lastMessage: 'Hello, I\'m interested in booking a private tour...',
      timestamp: '2d',
      status: 'Pre-contact',
      tourName: ''
    },
    {
      id: 5,
      name: 'Support',
      avatar: 'assets/images/ec901f1c0d6bdc3abb3b7f2578c96a444ee001e2.jpg',
      lastMessage: 'Your payout issue has been resolved...',
      timestamp: '3d',
      status: 'Open',
      tourName: ''
    }
  ];

  messages: Message[] = [
    {
      id: 1,
      sender: 'user',
      text: 'Hello! I just booked the Montmartre Art Walk for December 3rd. I\'m really excited about this tour!',
      timestamp: '2:34 PM'
    },
    {
      id: 2,
      sender: 'guide',
      text: 'Hi Sophie! Thank you for booking. I\'m looking forward to showing you the artistic side of Montmartre. The weather looks perfect for that day!',
      timestamp: '2:45 PM'
    },
    {
      id: 3,
      sender: 'user',
      text: 'Quick question - should I bring anything specific for the tour tomorrow? And what\'s the best way to get to the meeting point?',
      timestamp: '11:23 AM'
    },
    {
      id: 4,
      sender: 'guide',
      text: 'Great questions! Bring comfortable walking shoes and your camera. The meeting point is right at Abbesses metro station - take Line 12. I\'ll be there with a red umbrella. See you tomorrow! 🌂',
      timestamp: '2h ago'
    }
  ];

  bookingInfo = {
    tourName: 'Montmartre Art Walk',
    date: 'Dec 3, 2024',
    time: '10:00 AM (Paris time)',
    status: 'Confirmed',
    image: 'assets/images/ec901f1c0d6bdc3abb3b7f2578c96a444ee001e2.jpg'
  };

  ngOnInit() {
    // Select first conversation by default
    if (this.conversations.length > 0) {
      this.selectedConversation = this.conversations[0];
    }
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidebar() {
    this.isSidebarOpen = false;
  }

  selectConversation(conversation: Conversation) {
    this.selectedConversation = conversation;
    conversation.unread = false;
  }

  sendMessage() {
    if (this.newMessage.trim()) {
      this.messages.push({
        id: this.messages.length + 1,
        sender: 'guide',
        text: this.newMessage,
        timestamp: 'Just now'
      });
      this.newMessage = '';
    }
  }

  setFilter(filter: string) {
    this.activeFilter = filter;
  }

  get quotaPercentage(): number {
    return (this.contactQuota.used / this.contactQuota.total) * 100;
  }
}
