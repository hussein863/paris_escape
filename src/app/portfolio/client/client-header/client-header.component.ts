import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-client-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './client-header.component.html',
  styleUrl: './client-header.component.scss'
})
export class ClientHeaderComponent {
  userName = 'Sophie Laurent';
  userRole = 'Traveler';
  userAvatar = 'assets/images/avatar/sophie.png';
  hasNotifications = true;
}
