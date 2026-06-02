import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-business-info',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './business-info.component.html',
  styleUrl: './business-info.component.scss',
})
export class BusinessInfoComponent {
  companyName = '';
  siret = '';
  vatNumber = 'FR12345678901';
  publicEmail = 'marie@example.com';
  showEmailOnProfile = true;
  publicPhone = '+33 6 12 34 56 78';
  showPhoneOnProfile = false;
}
