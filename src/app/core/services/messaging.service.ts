import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Conversation, Message, PaginatedResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class MessagingService {
  private readonly api = `${environment.apiUrl}/messages`;

  constructor(private http: HttpClient) {}

  listConversations(): Observable<PaginatedResponse<Conversation>> {
    return this.http.get<PaginatedResponse<Conversation>>(`${this.api}/conversations/`);
  }

  getConversation(id: number): Observable<Conversation> {
    return this.http.get<Conversation>(`${this.api}/conversations/${id}/`);
  }

  sendMessage(conversationId: number, text: string): Observable<Message> {
    return this.http.post<Message>(`${this.api}/`, { conversation: conversationId, text });
  }

  /** Start a conversation anchored to a specific experience. */
  startConversationForExperience(experienceId: number): Observable<Conversation> {
    return this.http.post<Conversation>(`${this.api}/conversations/`, { experience: experienceId });
  }

  /** Start a conversation with a guide (no specific experience). */
  startConversationWithGuide(guideId: number): Observable<Conversation> {
    return this.http.post<Conversation>(`${this.api}/conversations/`, { guide: guideId });
  }

  getUnreadCount(): Observable<number> {
    return this.http.get<{ count: number }>(`${this.api}/conversations/unread-count/`).pipe(
      map(r => r.count)
    );
  }

  markAsRead(conversationId: number): Observable<any> {
    return this.http.post(`${this.api}/conversations/${conversationId}/mark-read/`, {});
  }
}
