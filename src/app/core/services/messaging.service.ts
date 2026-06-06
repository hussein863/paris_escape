import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
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

  startConversation(guideId: number): Observable<Conversation> {
    return this.http.post<Conversation>(`${this.api}/conversations/`, { guide: guideId });
  }
}
