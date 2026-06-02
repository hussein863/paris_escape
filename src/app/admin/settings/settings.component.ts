import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, SidebarComponent],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent {
  isSidebarOpen = false;
  activeTab = 'profile';
  profileVisibility = 'public';
  showEmail = true;
  showPhone = false;

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidebar(): void {
    this.isSidebarOpen = false;
  }

  setTab(tab: string): void {
    this.activeTab = tab;
  }

  setVisibility(visibility: string): void {
    this.profileVisibility = visibility;
  }

  saveChanges(): void {
    console.log('Saving changes...');
  }
}
