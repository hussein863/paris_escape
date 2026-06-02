import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { BasicInfoComponent } from './basic-info/basic-info.component';
import { BusinessInfoComponent } from './business-info/business-info.component';
import { LocationMediaComponent } from './location-media/location-media.component';
import { AvailabilityPricingComponent } from './availability-pricing/availability-pricing.component';
import { PoliciesVerificationComponent } from './policies-verification/policies-verification.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SidebarComponent,
    BasicInfoComponent,
    BusinessInfoComponent,
    LocationMediaComponent,
    AvailabilityPricingComponent,
    PoliciesVerificationComponent
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  profileCompleteness = 85;
  incompleteItems = 3;
  isSidebarOpen = false;
  profileImageUrl = '';

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidebar() {
    this.isSidebarOpen = false;
  }

  onAvatarClick() {
    const fileInput = document.getElementById('avatarUpload') as HTMLInputElement;
    fileInput?.click();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];

      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        alert('Please select a valid image file (JPEG, PNG, GIF, or WebP)');
        return;
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        alert('File size must be less than 5MB');
        return;
      }

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target?.result) {
          this.profileImageUrl = e.target.result as string;
        }
      };
      reader.readAsDataURL(file);
    }
  }
}
