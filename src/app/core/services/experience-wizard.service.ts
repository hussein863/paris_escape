import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Experience } from '../models';

@Injectable({ providedIn: 'root' })
export class ExperienceWizardService {
  private readonly api = `${environment.apiUrl}/experiences`;
  private _experienceId$ = new BehaviorSubject<number | null>(null);
  readonly experienceId$ = this._experienceId$.asObservable();

  get experienceId(): number | null { return this._experienceId$.value; }

  constructor(private http: HttpClient) {}

  setId(id: number): void { this._experienceId$.next(id); }
  clearId(): void { this._experienceId$.next(null); }

  create(data: Record<string, any>): Observable<Experience> {
    return this.http.post<Experience>(`${this.api}/`, data).pipe(
      tap(exp => this._experienceId$.next(exp.id))
    );
  }

  update(id: number, data: Record<string, any>): Observable<Experience> {
    return this.http.patch<Experience>(`${this.api}/${id}/`, data);
  }

  get(id: number): Observable<Experience> {
    return this.http.get<Experience>(`${this.api}/${id}/`);
  }

  uploadCover(id: number, file: File): Observable<Experience> {
    const fd = new FormData();
    fd.append('cover', file);
    return this.http.post<Experience>(`${this.api}/${id}/upload_cover/`, fd);
  }

  uploadMedia(id: number, file: File, caption: string = ''): Observable<any> {
    const fd = new FormData();
    fd.append('file', file);
    fd.append('caption', caption);
    return this.http.post<any>(`${this.api}/${id}/upload_media/`, fd);
  }

  deleteMedia(mediaId: number): Observable<any> {
    return this.http.delete(`${this.api}/media/${mediaId}/`);
  }

  // Bulk replace inclusions for an experience
  replaceInclusions(expId: number, items: {text: string; type: string; ordering: number}[]): Observable<any> {
    // Delete existing, then create new
    return new Observable(observer => {
      this.http.get<any[]>(`${this.api}/inclusions/?experience=${expId}`).subscribe({
        next: (existing) => {
          const deleteAll = existing.map(i => this.http.delete(`${this.api}/inclusions/${i.id}/`));
          Promise.all(deleteAll.map(d => d.toPromise())).then(() => {
            const creates = items.map(item =>
              this.http.post(`${this.api}/inclusions/`, { experience: expId, ...item }).toPromise()
            );
            Promise.all(creates).then(() => { observer.next(true); observer.complete(); });
          });
        },
        error: err => observer.error(err)
      });
    });
  }

  // Replace options for an experience
  replaceOptions(expId: number, options: any[]): Observable<any> {
    return new Observable(observer => {
      this.http.get<any[]>(`${this.api}/options/?experience=${expId}`).subscribe({
        next: (existing) => {
          const deleteAll = existing.map(o => this.http.delete(`${this.api}/options/${o.id}/`));
          Promise.all(deleteAll.map(d => d.toPromise())).then(() => {
            const creates = options.map(opt =>
              this.http.post(`${this.api}/options/`, { experience: expId, ...opt }).toPromise()
            );
            Promise.all(creates).then(() => { observer.next(true); observer.complete(); });
          });
        },
        error: err => observer.error(err)
      });
    });
  }

  // Save or update availability + time slots
  saveAvailability(expId: number, data: any, timeSlots: any[]): Observable<any> {
    return new Observable(observer => {
      this.http.get<any[]>(`${this.api}/availability/?experience=${expId}`).subscribe({
        next: (existing) => {
          const avail = existing[0];
          const availObs = avail
            ? this.http.patch<any>(`${this.api}/availability/${avail.id}/`, { ...data })
            : this.http.post<any>(`${this.api}/availability/`, { experience: expId, ...data });

          availObs.subscribe({
            next: (saved) => {
              // Delete existing time slots and re-create
              const existingSlots = saved.time_slots || [];
              Promise.all(existingSlots.map((s: any) =>
                this.http.delete(`${this.api}/timeslots/${s.id}/`).toPromise()
              )).then(() => {
                Promise.all(timeSlots.map(slot =>
                  this.http.post(`${this.api}/timeslots/`, { availability: saved.id, time: slot.time, label: slot.label }).toPromise()
                )).then(() => { observer.next(saved); observer.complete(); });
              });
            },
            error: err => observer.error(err)
          });
        },
        error: err => observer.error(err)
      });
    });
  }

  savePolicy(expId: number, data: any): Observable<any> {
    return new Observable(observer => {
      this.http.get<any[]>(`${this.api}/policies/?experience=${expId}`).subscribe({
        next: (existing) => {
          const policy = existing[0];
          const obs = policy
            ? this.http.patch(`${this.api}/policies/${policy.id}/`, data)
            : this.http.post(`${this.api}/policies/`, { experience: expId, ...data });
          obs.subscribe({
            next: v => { observer.next(v); observer.complete(); },
            error: err => observer.error(err)
          });
        },
        error: err => observer.error(err)
      });
    });
  }

  publish(id: number): Observable<Experience> {
    return this.http.post<Experience>(`${this.api}/${id}/publish/`, {});
  }
}
