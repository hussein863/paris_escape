import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from './sidebar/sidebar.component';
import { SaHeaderComponent } from './header/header.component';

@Component({
  selector: 'app-super-admin',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent, SaHeaderComponent],
  templateUrl: './super-admin.component.html',
  styleUrls: ['./super-admin.component.scss']
})
export class SuperAdminComponent {}
