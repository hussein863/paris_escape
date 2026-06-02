import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

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
export class MeetingPointComponent {
  @Input() meetingPoint: MeetingPoint = {
    name: '',
    address: '',
    instructions: '',
    metro: ''
  };

  openMaps(): void {
    const query = encodeURIComponent(this.meetingPoint.address);
    window.open(`https://maps.google.com/?q=${query}`, '_blank');
  }
}
