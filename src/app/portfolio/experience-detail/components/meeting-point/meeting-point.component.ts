import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

interface MeetingPoint {
  name: string;
  address: string;
  instructions: string;
  metro: string;
}

@Component({
  selector: 'app-meeting-point',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './meeting-point.component.html',
  styleUrl: './meeting-point.component.scss'
})
export class MeetingPointComponent implements OnChanges {
  @Input() meetingPoint: MeetingPoint = {
    name: '',
    address: '',
    instructions: '',
    metro: ''
  };

  mapsEmbedUrl: SafeResourceUrl = '';

  constructor(private sanitizer: DomSanitizer) {}

  ngOnChanges(): void {
    const q = encodeURIComponent(this.meetingPoint.address || this.meetingPoint.name || 'Paris, France');
    this.mapsEmbedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://maps.google.com/maps?q=${q}&output=embed&z=16`
    );
  }

  openMaps(): void {
    const query = encodeURIComponent(this.meetingPoint.address || this.meetingPoint.name);
    window.open(`https://maps.google.com/?q=${query}`, '_blank');
  }
}
