import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
export class StepMediaComponent {
  @Output() dataChange = new EventEmitter<any>();

  mediaPlan = {
    plan: 'Basic Plan',
    slotsUsed: 5,
    totalSlots: 10
  };

  coverImage: MediaFile | null = null;
  galleryPhotos: MediaFile[] = [
    {
      id: '1',
      url: 'assets/images/7a7113833eadb15abfafa4514a2f369ae3bd1ba6.png',
      caption: '',
      type: 'image'
    },
    {
      id: '2',
      url: 'assets/images/878d3e8ad6794dd8a9549ec87d000a314f995acc.png',
      caption: '',
      type: 'image'
    },
    {
      id: '3',
      url: 'assets/images/4881259d9ed9a0877b3b8ab62a22da225796a349.png',
      caption: '',
      type: 'image'
    },
    {
      id: '4',
      url: 'assets/images/ba961a02d223dbe18a01f685691568d55461e116.png',
      caption: '',
      type: 'image'
    }
  ];
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
        url: 'E:\\Free\\paris\\src\\assets\\images\\3318308e4a5ae77766100115d8d2d8e7f6518919.png',
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
      videoTeaser: this.videoTeaser
    });
  }

  upgradePlan(): void {
    console.log('Upgrade plan clicked');
  }

  upgradeToPremium(): void {
    console.log('Upgrade to premium clicked');
  }

  contactSupport(): void {
    console.log('Contact support clicked');
  }
}
