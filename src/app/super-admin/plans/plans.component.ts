import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-sa-plans',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './plans.component.html',
  styleUrl: './plans.component.scss'
})
export class SaPlansComponent {
  plans: any[] = [];
  loading = true;

  // Edit panel
  editPlan: any = null;
  editOpen = false;
  saving = false;
  saveError = '';

  // New feature input
  newFeature = '';

  constructor(private http: HttpClient) { this.load(); }

  load(): void {
    this.http.get<any>(`${environment.apiUrl}/superadmin/plans/`).subscribe({
      next: (res) => { this.plans = res.results ?? res; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  openEdit(plan: any): void {
    // Deep-copy so we don't mutate the card while editing
    this.editPlan = {
      ...plan,
      features: [...(plan.features || [])],
      max_experiences: plan.max_experiences ?? null,
    };
    this.newFeature = '';
    this.saveError = '';
    this.editOpen = true;
  }

  closeEdit(): void {
    this.editOpen = false;
    this.editPlan = null;
  }

  addFeature(): void {
    const f = this.newFeature.trim();
    if (!f) return;
    this.editPlan.features = [...this.editPlan.features, f];
    this.newFeature = '';
  }

  removeFeature(i: number): void {
    this.editPlan.features = this.editPlan.features.filter((_: any, idx: number) => idx !== i);
  }

  save(): void {
    this.saving = true;
    this.saveError = '';
    const nullOrInt = (v: any) => (v === '' || v === null || v === undefined) ? null : +v;
    const payload = {
      name: this.editPlan.name,
      tagline: this.editPlan.tagline,
      price_monthly: this.editPlan.price_monthly,
      price_yearly: this.editPlan.price_yearly,
      max_experiences: nullOrInt(this.editPlan.max_experiences),
      max_images_per_experience: nullOrInt(this.editPlan.max_images_per_experience),
      max_contacts: nullOrInt(this.editPlan.max_contacts),
      max_bookings: nullOrInt(this.editPlan.max_bookings),
      has_analytics: this.editPlan.has_analytics,
      has_priority_search: this.editPlan.has_priority_search,
      has_verified_badge: this.editPlan.has_verified_badge,
      video_content: this.editPlan.video_content,
      has_3d_visit: this.editPlan.has_3d_visit,
      top_listing_days: nullOrInt(this.editPlan.top_listing_days),
      business_card: this.editPlan.business_card,
      features: this.editPlan.features,
      is_active: this.editPlan.is_active,
      is_popular: this.editPlan.is_popular,
    };
    this.http.patch<any>(`${environment.apiUrl}/superadmin/plans/${this.editPlan.id}/`, payload)
      .subscribe({
        next: (res) => {
          const idx = this.plans.findIndex(p => p.id === res.id);
          if (idx !== -1) this.plans[idx] = res;
          this.saving = false;
          this.closeEdit();
        },
        error: () => { this.saving = false; this.saveError = 'Failed to save. Please try again.'; }
      });
  }
}
