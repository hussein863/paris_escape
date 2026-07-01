import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExperienceWizardService } from '../../../../core/services/experience-wizard.service';
import { PlanFeaturesService } from '../../../../core/services/plan-features.service';

interface MediaFile {
  id: string;
  file?: File;
  url: string;
  caption: string;
  type: 'image' | 'video';
}

@Component({
  selector: 'app-step-media',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './step-media.component.html',
  styleUrl: './step-media.component.scss',
})
export class StepMediaComponent implements OnInit {
  @Input() prefillData: any;
  @Output() dataChange = new EventEmitter<any>();

  hasVideoContent = false;
  has3dVisit = false;
  videoUrl = '';
  virtualTourUrl = '';

  constructor(
    private wizardService: ExperienceWizardService,
    private planFeatures: PlanFeaturesService,
  ) {}

  ngOnInit(): void {
    const features = this.planFeatures.snapshot;
    this.hasVideoContent = features.video_content;
    this.has3dVisit = features.has_3d_visit;
    // Load from plan features (async in case not yet loaded)
    this.planFeatures.load().subscribe({
      next: (f) => { this.hasVideoContent = f.video_content; this.has3dVisit = f.has_3d_visit; },
      error: () => {}
    });

    if (this.prefillData) {
      if (this.prefillData.cover_image_url) {
        this.coverImage = {
          id: 'cover',
          url: this.prefillData.cover_image_url,
          caption: '',
          type: 'image'
        };
      }
      if (this.prefillData.gallery_images && Array.isArray(this.prefillData.gallery_images)) {
        this.galleryPhotos = this.prefillData.gallery_images.map((img: any, i: number) => ({
          id: String(img.id ?? i),
          url: img.image_url ?? img.url ?? '',
          caption: img.caption ?? '',
          type: 'image'
        }));
      }
    }
  }

  saveToApi(): Promise<void> {
    const id = this.wizardService.experienceId;
    if (!id) return Promise.resolve();

    return new Promise((resolve, reject) => {
      const uploads: Promise<void>[] = [];

      // Upload cover image if a file was selected
      if (this.coverImage?.file) {
        uploads.push(
          this.wizardService.uploadCover(id, this.coverImage.file).toPromise().then(() => {})
        );
      }

      // Upload gallery photos that have actual files (not pre-existing mock URLs)
      this.galleryPhotos.forEach(photo => {
        if (photo.file) {
          uploads.push(
            this.wizardService.uploadMedia(id, photo.file, photo.caption).toPromise().then(() => {})
          );
        }
      });

      Promise.all(uploads).then(() => resolve()).catch(reject);
    });
  }

  mediaPlan = {
    plan: 'Basic Plan',
    slotsUsed: 0,
    totalSlots: 10
  };

  coverImage: MediaFile | null = null;
  galleryPhotos: MediaFile[] = [];
  videoTeaser: MediaFile | null = null;

  photoTips = [
    'Use high-quality images (min. 1200px wide)',
    'Show different aspects of your experience',
    'Include people enjoying the activity',
    'Capture unique moments and details'
  ];

  quickTips = [
    'Use natural lighting for best results',
    'Show diverse perspectives and angles',
    'Include people experiencing the tour',
    'Keep images authentic and unfiltered'
  ];

  get slotsRemaining(): number {
    return this.mediaPlan.totalSlots - this.mediaPlan.slotsUsed;
  }

  get progressPercentage(): number {
    return (this.mediaPlan.slotsUsed / this.mediaPlan.totalSlots) * 100;
  }

  get mediaCompletion() {
    return {
      coverImage: !!this.coverImage,
      galleryPhotos: this.galleryPhotos.length > 0,
      videoTeaser: !!this.videoTeaser,
      media360: false
    };
  }

  onCoverImageSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.coverImage = {
        id: Date.now().toString(),
        file: file,
        url: URL.createObjectURL(file),
        caption: '',
        type: 'image'
      };
      this.mediaPlan.slotsUsed++;
      this.emitData();
    }
  }

  onGalleryPhotoSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      Array.from(input.files).forEach(file => {
        if (this.slotsRemaining > 0) {
          const photo: MediaFile = {
            id: Date.now().toString() + Math.random(),
            file: file,
            url: URL.createObjectURL(file),
            caption: '',
            type: 'image'
          };
          this.galleryPhotos.push(photo);
          this.mediaPlan.slotsUsed++;
        }
      });
      this.emitData();
    }
  }

  onVideoSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.videoTeaser = {
        id: Date.now().toString(),
        file: file,
        url: URL.createObjectURL(file),
        caption: '',
        type: 'video'
      };
      this.emitData();
    }
  }

  removeGalleryPhoto(id: string): void {
    this.galleryPhotos = this.galleryPhotos.filter(photo => photo.id !== id);
    this.mediaPlan.slotsUsed--;
    this.emitData();
  }

  removeCoverImage(): void {
    this.coverImage = null;
    this.mediaPlan.slotsUsed--;
    this.emitData();
  }

  removeVideoTeaser(): void {
    this.videoTeaser = null;
    this.emitData();
  }

  updateCaption(id: string, caption: string): void {
    const photo = this.galleryPhotos.find(p => p.id === id);
    if (photo) {
      photo.caption = caption;
      this.emitData();
    }
  }

  emitData(): void {
    this.dataChange.emit({
      coverImage: this.coverImage,
      galleryPhotos: this.galleryPhotos,
      videoTeaser: this.videoTeaser,
      videoUrl: this.videoUrl,
      virtualTourUrl: this.virtualTourUrl,
    });
  }

  upgradePlan(): void {
    /* not implemented */
  }

  upgradeToPremium(): void {
    /* not implemented */
  }

  contactSupport(): void {
    /* not implemented */
  }
}

