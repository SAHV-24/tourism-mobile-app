import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from './base.service';
import { Visit } from '../models/visit.model';
import { Observable, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VisitService extends BaseService<Visit> {
  protected endpoint = 'visitas';

  constructor(protected override http: HttpClient) {
    super(http);
  }

  /**
   * Get visits by user id
   */
  getByUserId(userId: string): Observable<Visit[]> {
    return this.http.get<Visit[]>(`${this.apiUrl}/${this.endpoint}/usuario/${userId}`).pipe(
      catchError(this.handleError<Visit[]>('getByUserId', []))
    );
  }

  /**
   * Get visits by site id
   */
  getBySiteId(siteId: string): Observable<Visit[]> {
    return this.http.get<Visit[]>(`${this.apiUrl}/${this.endpoint}/site/${siteId}`).pipe(
      catchError(this.handleError<Visit[]>('getBySiteId', []))
    );
  }

  /**
   * Get visits by date range
   */
  getByDateRange(startDate: Date, endDate: Date): Observable<Visit[]> {
    const start = startDate.toISOString().split('T')[0];
    const end = endDate.toISOString().split('T')[0];
    return this.http.get<Visit[]>(`${this.apiUrl}/${this.endpoint}/date-range?start=${start}&end=${end}`).pipe(
      catchError(this.handleError<Visit[]>('getByDateRange', []))
    );
  }
}
