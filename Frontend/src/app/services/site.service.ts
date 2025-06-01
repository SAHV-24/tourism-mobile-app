import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from './base.service';
import { Site } from '../models/site.model';
import { Observable, catchError } from 'rxjs';
import { SiteCategoryEnum } from '../models/enums';

@Injectable({
  providedIn: 'root'
})
export class SiteService extends BaseService<Site> {
  protected endpoint = 'sitios';

  constructor(protected override http: HttpClient) {
    super(http);
  }

  /**
   * Get sites by city id
   */
  getByCityId(cityId: number): Observable<Site[]> {
    return this.http.get<Site[]>(`${this.apiUrl}/${this.endpoint}/city/${cityId}`).pipe(
      catchError(this.handleError<Site[]>('getByCityId', []))
    );
  }

  /**
   * Get sites by category
   */
  getByCategory(category: SiteCategoryEnum): Observable<Site[]> {
    return this.http.get<Site[]>(`${this.apiUrl}/${this.endpoint}/category/${category}`).pipe(
      catchError(this.handleError<Site[]>('getByCategory', []))
    );
  }

  /**
   * Get sites by coordinates (nearby sites)
   */
  getNearby(latitude: number, longitude: number, radius: number = 5): Observable<Site[]> {
    return this.http.get<Site[]>(
      `${this.apiUrl}/${this.endpoint}/nearby?lat=${latitude}&lng=${longitude}&radius=${radius}`
    ).pipe(
      catchError(this.handleError<Site[]>('getNearby', []))
    );
  }
}
