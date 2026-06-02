import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface MeetingPoint {
  name: string;
  address: string;
  isDefault: boolean;
}

@Component({
  selector: 'app-location-media',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './location-media.component.html',
  styleUrl: './location-media.component.scss',
})
export class LocationMediaComponent {
  baseCity = 'Paris';
  neighborhood = 'Montmartre';

  meetingPoints: MeetingPoint[] = [
    { name: 'Place du Tertre', address: '18 Rue Norvins, 75018 Paris', isDefault: true },
    { name: 'Sacré-Cœur Entrance', address: '35 Rue du Chevalier de la Barre, 75018 Paris', isDefault: false }
  ];

  coverImage = 'assets/images/acc846deee9f5e03d93d334df1ff7680d3724f17.png';
  photoGallery = [
    'assets/images/a2b88efd245e430fc327bf8e5601ffb8ad58b27a.png',
    'assets/images/f8b015aeb0f947d995c74cf52ecdc285c341ef38.png',
    'assets/images/1acd1ea07c30012f7c10b9241ad1b66feb662a06.png'
  ];

  addMeetingPoint() {
    this.meetingPoints.push({ name: '', address: '', isDefault: false });
  }

  removeMeetingPoint(index: number) {
    this.meetingPoints.splice(index, 1);
  }

  setDefaultMeetingPoint(index: number) {
    this.meetingPoints.forEach((point, i) => {
      point.isDefault = i === index;
    });
  }

  updateLocation() {
    // Open map modal
    alert('Map modal would open here');
  }

  uploadCover() {
    alert('File upload would trigger here');
  }

  addPhotos() {
    alert('File upload would trigger here');
  }

  removePhoto(index: number) {
    this.photoGallery.splice(index, 1);
  }

  uploadVideo() {
    alert('File upload would trigger here');
  }

  downloadQRCode() {
    alert('QR code download would trigger here');
  }
}
