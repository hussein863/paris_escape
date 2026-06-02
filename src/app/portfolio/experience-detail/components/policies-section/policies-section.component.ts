import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Policy {
  title: string;
  description: string;
}

@Component({
  selector: 'app-policies-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './policies-section.component.html',
  styleUrl: './policies-section.component.scss'
})
export class PoliciesSectionComponent {
  @Input() policies: Policy[] = [];
}
