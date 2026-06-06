import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { AdminHeaderComponent } from '../header/admin-header.component';
import { environment } from '../../../environments/environment';

interface KYCDoc {
  id: number;
  category: string;
  status: 'verified' | 'in-review' | 'not-started';
  status_text: string;
  file: string | null;
  uploaded_date: string | null;
}

interface KYCData {
  id: number;
  person_type: 'individual' | 'company';
  is_micro_enterprise: boolean;
  pep_screening: boolean;
  data_protection: boolean;
  accuracy_confirmation: boolean;
  verification_status: string;
  documents: KYCDoc[];
}

@Component({
  selector: 'app-kyc',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent, AdminHeaderComponent],
  templateUrl: './kyc.component.html',
  styleUrl: './kyc.component.scss'
})
export class KycComponent implements OnInit {
  isSidebarOpen = false;
  loading = true;
  saving = false;
  error = '';
  successMsg = '';

  kyc: KYCData | null = null;

  // Form fields
  personType: 'individual' | 'company' = 'individual';
  isMicroEnterprise = false;
  pepScreening = false;
  dataProtection = false;
  accuracyConfirmation = false;

  uploadingCategory: string | null = null;

  readonly categories = ['Identity', 'Address', 'Business & Tax', 'Bank Account'];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.http.get<{ results: KYCData[] }>(`${environment.apiUrl}/kyc/`).subscribe({
      next: (res) => {
        if (res.results.length > 0) {
          this.setKyc(res.results[0]);
        }
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  get auditLog(): { title: string; description: string; timestamp: string; status: string }[] {
    if (!this.kyc) return [];
    return this.kyc.documents
      .filter(d => d.uploaded_date)
      .sort((a, b) => new Date(b.uploaded_date!).getTime() - new Date(a.uploaded_date!).getTime())
      .map(d => ({
        title: `${d.category} document ${d.status === 'verified' ? 'verified' : d.status === 'in-review' ? 'submitted' : 'uploaded'}`,
        description: d.status_text || `Status: ${d.status}`,
        timestamp: new Date(d.uploaded_date!).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        status: d.status,
      }));
  }

  setKyc(data: KYCData): void {
    this.kyc = data;
    this.personType = data.person_type;
    this.isMicroEnterprise = data.is_micro_enterprise;
    this.pepScreening = data.pep_screening;
    this.dataProtection = data.data_protection;
    this.accuracyConfirmation = data.accuracy_confirmation;
  }

  setPersonType(type: 'individual' | 'company'): void { this.personType = type; }

  checkVAT(): void { /* VAT validation is handled server-side on save */ }

  saveBankAccount(): void { this.save(); }

  downloadPDF(): void {
    this.http.get<Blob>(`${environment.apiUrl}/users/export_data/`, { responseType: 'blob' as 'json' }).subscribe({
      next: (data: any) => {
        const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'kyc-data.json';
        a.click();
      }
    });
  }

  downloadData(): void { this.downloadPDF(); }

  save(): void {
    this.saving = true;
    this.successMsg = '';
    this.error = '';
    const payload = {
      person_type: this.personType,
      is_micro_enterprise: this.isMicroEnterprise,
      pep_screening: this.pepScreening,
      data_protection: this.dataProtection,
      accuracy_confirmation: this.accuracyConfirmation,
    };

    const req = this.kyc
      ? this.http.patch<KYCData>(`${environment.apiUrl}/kyc/${this.kyc.id}/`, payload)
      : this.http.post<KYCData>(`${environment.apiUrl}/kyc/`, payload);

    req.subscribe({
      next: (data) => {
        this.setKyc(data);
        this.successMsg = 'KYC information saved.';
        this.saving = false;
      },
      error: () => { this.error = 'Failed to save.'; this.saving = false; }
    });
  }

  uploadDocument(category: string, event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file || !this.kyc) return;

    this.uploadingCategory = category;
    const fd = new FormData();
    fd.append('kyc', String(this.kyc.id));
    fd.append('category', category);
    fd.append('file', file);

    // Check if document for this category already exists
    const existing = this.getDoc(category);
    const req = existing
      ? this.http.patch<KYCDoc>(`${environment.apiUrl}/kyc/documents/${existing.id}/`, fd)
      : this.http.post<KYCDoc>(`${environment.apiUrl}/kyc/documents/`, fd);

    req.subscribe({
      next: (doc) => {
        if (this.kyc) {
          const idx = this.kyc.documents.findIndex(d => d.category === category);
          if (idx >= 0) this.kyc.documents[idx] = doc;
          else this.kyc.documents.push(doc);
        }
        this.uploadingCategory = null;
      },
      error: () => { this.uploadingCategory = null; }
    });
  }

  getDoc(category: string): KYCDoc | undefined {
    return this.kyc?.documents.find(d => d.category === category);
  }

  getDocStatus(category: string): 'verified' | 'in-review' | 'not-started' {
    return this.getDoc(category)?.status ?? 'not-started';
  }

  getDocStatusText(category: string): string {
    const doc = this.getDoc(category);
    if (!doc) return 'Not started';
    return doc.status_text || { 'verified': 'Documents verified', 'in-review': 'Under review', 'not-started': 'Not uploaded' }[doc.status];
  }

  get overallStatus(): string { return this.kyc?.verification_status ?? 'not-started'; }
  get verifiedCount(): number { return this.kyc?.documents.filter(d => d.status === 'verified').length ?? 0; }

  toggleSidebar(): void { this.isSidebarOpen = !this.isSidebarOpen; }
  closeSidebar(): void { this.isSidebarOpen = false; }
}
