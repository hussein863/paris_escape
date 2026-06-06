import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from "../sidebar/sidebar.component";
import { AdminHeaderComponent } from "../header/admin-header.component";
import { StatisticsComponent } from "./statistics/statistics.component";
import { ExperienceComponent } from "./experience/experience.component";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  imports: [CommonModule, SidebarComponent, AdminHeaderComponent, StatisticsComponent, ExperienceComponent],
})
export class DashboardComponent {
  isSidebarOpen = false;

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidebar(): void {
    this.isSidebarOpen = false;
  }
}
