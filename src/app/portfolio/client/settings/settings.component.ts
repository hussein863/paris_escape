import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClientHeaderComponent } from "../client-header/client-header.component";

interface CountryCode {
  code: string;
  dial: string;
}

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, ClientHeaderComponent],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {
  activeTab: 'profile' | 'account' | 'notifications' | 'privacy' | 'security' = 'profile';

  // Profile Photo
  profilePhoto = 'assets/images/avatar/james.png';

  // Personal Information
  firstName = 'Alexandre';
  lastName = 'Moreau';
  email = 'alexandre.moreau@email.com';
  phoneCode = '+33';
  phoneNumber = '6 12 34 56 78';
  country = 'France';

  // Preferences
  preferredLanguage = 'FR';
  currency = 'EUR (€)';

  // Emergency Contact
  emergencyContactName = '';
  emergencyContactCode = '+33';
  emergencyContactPhone = '';

  countryCodes: CountryCode[] = [
    { code: 'FR', dial: '+33' },
    { code: 'US', dial: '+1' },
    { code: 'UK', dial: '+44' },
    { code: 'ES', dial: '+34' },
    { code: 'DE', dial: '+49' },
    { code: 'IT', dial: '+39' }
  ];

  countries = ['France', 'United States', 'United Kingdom', 'Spain', 'Germany', 'Italy'];
  languages = ['FR', 'EN', 'ES', 'DE', 'IT'];
  currencies = ['EUR (€)', 'USD ($)', 'GBP (£)'];

  setActiveTab(tab: 'profile' | 'account' | 'notifications' | 'privacy' | 'security') {
    this.activeTab = tab;
  }

  uploadPhoto() {
    // Implement file upload logic
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event: any) => {
          this.profilePhoto = event.target.result;
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  }

  removePhoto() {
    this.profilePhoto = 'assets/images/avatar/default.jpg';
  }

  saveChanges() {
    // Implement save logic
    console.log('Saving changes...');
    // Show success message
  }
}
