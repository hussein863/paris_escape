import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-client-sidebar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './client-sidebar.component.html',
  styleUrl: './client-sidebar.component.scss',
})
export class ClientSidebarComponent {
  isOpen = false;

  toggleSidebar(): void {
    this.isOpen = !this.isOpen;
  }

  closeSidebar(): void {
    this.isOpen = false;
  }
}
