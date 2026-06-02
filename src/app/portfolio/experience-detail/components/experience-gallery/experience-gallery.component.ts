import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

interface GalleryImage {
  url: string;
  alt: string;
}

@Component({
  selector: 'app-experience-gallery',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './experience-gallery.component.html',
  styleUrl: './experience-gallery.component.scss'
})
export class ExperienceGalleryComponent {
  @Input() images: GalleryImage[] = [];
  @Input() duration: string = '';
  @Input() maxGuests: number = 0;

  selectedImageIndex = 0;
  isLightboxOpen = false;

  get mainImage(): GalleryImage {
    return this.images[this.selectedImageIndex] || { url: '', alt: '' };
  }

  get thumbnails(): GalleryImage[] {
    return this.images.slice(1, 5);
  }

  get remainingCount(): number {
    return Math.max(0, this.images.length - 5);
  }

  selectImage(index: number): void {
    this.selectedImageIndex = index;
  }

  openLightbox(index?: number): void {
    if (index !== undefined) {
      this.selectedImageIndex = index;
    }
    this.isLightboxOpen = true;
    document.body.style.overflow = 'hidden';
  }

  closeLightbox(): void {
    this.isLightboxOpen = false;
    document.body.style.overflow = '';
  }

  prevImage(): void {
    this.selectedImageIndex = this.selectedImageIndex === 0 
      ? this.images.length - 1 
      : this.selectedImageIndex - 1;
  }

  nextImage(): void {
    this.selectedImageIndex = this.selectedImageIndex === this.images.length - 1 
      ? 0 
      : this.selectedImageIndex + 1;
  }
}
