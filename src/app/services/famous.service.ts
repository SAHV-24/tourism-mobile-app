import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from './base.service';
import { Famous } from '../models/famous.model';
import { Observable, catchError } from 'rxjs';
import { ActivityEnum } from '../models/enums';

@Injectable({
  providedIn: 'root'
})
export class FamousService extends BaseService<Famous> {
  protected endpoint = 'famosos';

  constructor(protected override http: HttpClient) {
    super(http);
  }

  /**
   * Get famous people by city id
   */
  getByCityId(cityId: number): Observable<Famous[]> {
    return this.http.get<Famous[]>(`${this.apiUrl}/${this.endpoint}/city/${cityId}`).pipe(
      catchError(this.handleError<Famous[]>('getByCityId', []))
    );
  }

  /**
   * Get famous people by activity
   */
  getByActivity(activity: ActivityEnum): Observable<Famous[]> {
    return this.http.get<Famous[]>(`${this.apiUrl}/${this.endpoint}/activity/${activity}`).pipe(
      catchError(this.handleError<Famous[]>('getByActivity', []))
    );
  }
}
