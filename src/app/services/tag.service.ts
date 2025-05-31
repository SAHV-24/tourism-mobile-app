import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from './base.service';
import { Tag } from '../models/tag.model';
import { Observable, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TagService extends BaseService<Tag> {
  protected endpoint = 'tags';

  constructor(protected override http: HttpClient) {
    super(http);
  }

  /**
   * Get tags by user id
   */
  getByUserId(userId: string): Observable<Tag[]> {
    return this.http.get<Tag[]>(`${this.apiUrl}/${this.endpoint}/usuario/${userId}`).pipe(
      catchError(this.handleError<Tag[]>('getByUserId', []))
    );
  }

  /**
   * Get tags by famous id
   */
  getByFamousId(famousId: string): Observable<Tag[]> {
    return this.http.get<Tag[]>(`${this.apiUrl}/${this.endpoint}/famoso/${famousId}`).pipe(
      catchError(this.handleError<Tag[]>('getByFamousId', []))
    );
  }

  /**
   * Get tags by date range
   */
  getByDateRange(startDate: Date, endDate: Date): Observable<Tag[]> {
    const start = startDate.toISOString().split('T')[0];
    const end = endDate.toISOString().split('T')[0];
    return this.http.get<Tag[]>(`${this.apiUrl}/${this.endpoint}/date-range?start=${start}&end=${end}`).pipe(
      catchError(this.handleError<Tag[]>('getByDateRange', []))
    );
  }
}
