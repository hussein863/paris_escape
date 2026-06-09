import { Component, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GuideProfileService } from '../../../core/services/guide-profile.service';

interface MeetingPointRow {
  id: number | null;
  name: string;
  address: string;
  is_default: boolean;
}

@Component({
  selector: 'app-location-media',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './location-media.component.html',
  styleUrl: './location-media.component.scss',
})
export class LocationMediaComponent implements OnInit {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  baseCity = 'Paris';
  neighborhood = '';

  meetingPoints: MeetingPointRow[] = [];
  showAddMeetingPoint = false;
  newMpName = '';
  newMpAddress = '';

  coverImageUrl: string | null = null;
  galleryPhotos: { id: number; image_url: string; ordering: number }[] = [];

  locationSaving = false;
  coverUploading = false;
  galleryUploading = false;
  toast: { message: string; type: 'success' | 'error' } | null = null;
  private toastTimer: any;

  showToast(message: string, type: 'success' | 'error' = 'success'): void {
    clearTimeout(this.toastTimer);
    this.toast = { message, type };
    this.toastTimer = setTimeout(() => { this.toast = null; }, 3500);
  }

  constructor(private guideService: GuideProfileService) {}

  ngOnInit(): void {
    this.guideService.profile$.subscribe(p => {
      if (!p) return;
      this.baseCity = p.base_city;
      this.neighborhood = p.neighborhood;
      this.coverImageUrl = p.cover_image_url;
      this.meetingPoints = p.meeting_points.map(mp => ({ ...mp }));
      this.galleryPhotos = [...p.gallery_photos];
    });
  }

  saveLocation(): void {
    this.locationSaving = true;
    this.guideService.patch({ base_city: this.baseCity, neighborhood: this.neighborhood }).subscribe({
      next: () => { this.locationSaving = false; this.showToast('Location saved!'); },
      error: () => { this.locationSaving = false; this.showToast('Failed to save location.', 'error'); },
    });
  }

  // Cover image
  triggerCoverUpload(): void {
    if (!this.isBrowser) return;
    (document.getElementById('coverUpload') as HTMLInputElement)?.click();
  }

  onCoverSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.coverUploading = true;
    this.guideService.uploadCover(file).subscribe({
      next: (p) => {
        this.coverImageUrl = p.cover_image_url;
        this.coverUploading = false;
      },
      error: () => { this.coverUploading = false; },
    });
  }

  // Gallery
  triggerGalleryUpload(): void {
    if (!this.isBrowser) return;
    (document.getElementById('galleryUpload') as HTMLInputElement)?.click();
  }

  onGallerySelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.galleryUploading = true;
    this.guideService.uploadGalleryPhoto(file).subscribe({
      next: (photo) => {
        this.galleryPhotos.push(photo);
        this.galleryUploading = false;
        this.guideService.load().subscribe();
      },
      error: () => { this.galleryUploading = false; },
    });
  }

  removePhoto(photo: { id: number; image_url: string; ordering: number }, index: number): void {
    this.guideService.deleteGalleryPhoto(photo.id).subscribe(() => {
      this.galleryPhotos.splice(index, 1);
      this.guideService.load().subscribe();
    });
  }

  // Meeting points
  startAddMeetingPoint(): void {
    this.showAddMeetingPoint = true;
    this.newMpName = '';
    this.newMpAddress = '';
  }

  confirmAddMeetingPoint(): void {
    if (!this.newMpName.trim()) {
      this.showAddMeetingPoint = false;
      return;
    }
    this.guideService.addMeetingPoint({
      name: this.newMpName.trim(),
      address: this.newMpAddress.trim(),
      is_default: this.meetingPoints.length === 0,
    }).subscribe(mp => {
      this.meetingPoints.push(mp);
      this.showAddMeetingPoint = false;
      this.guideService.load().subscribe();
    });
  }

  setDefaultMeetingPoint(mp: MeetingPointRow): void {
    if (!mp.id) return;
    this.guideService.setDefaultMeetingPoint(mp.id).subscribe(() => {
      this.meetingPoints.forEach(p => (p.is_default = p.id === mp.id));
      this.guideService.load().subscribe();
    });
  }

  removeMeetingPoint(mp: MeetingPointRow, index: number): void {
    if (!mp.id) { this.meetingPoints.splice(index, 1); return; }
    this.guideService.deleteMeetingPoint(mp.id).subscribe(() => {
      this.meetingPoints.splice(index, 1);
      this.guideService.load().subscribe();
    });
  }

  downloadQRCode(): void {
    // QR code download — placeholder for future implementation
  }
}
