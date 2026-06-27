import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Guide } from '../guide-profile.component';

@Component({
  selector: 'app-profile-location',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile-location.component.html',
  styleUrl: './profile-location.component.scss'
})
export class ProfileLocationComponent implements OnChanges {
  @Input() guide!: Guide;
  mapsEmbedUrl: SafeResourceUrl | null = null;

  constructor(private sanitizer: DomSanitizer) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['guide'] && this.guide) {
      const address = this.guide.meetingPoint?.address || this.guide.location || '';
      if (address) {
        const q = encodeURIComponent(address);
        const url = `https://maps.google.com/maps?q=${q}&output=embed&z=16`;
        this.mapsEmbedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
      }
    }
  }
}
