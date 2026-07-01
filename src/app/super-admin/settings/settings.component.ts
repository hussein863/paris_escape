import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sa-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SaSettingsComponent {
  activeSection = 'general';

  sections = [
    { id: 'general', label: 'General', icon: 'sliders-h' },
    { id: 'fees', label: 'Fees & Commission', icon: 'percent' },
    { id: 'emails', label: 'Email Templates', icon: 'envelope' },
    { id: 'security', label: 'Security', icon: 'shield-alt' },
  ];
}
