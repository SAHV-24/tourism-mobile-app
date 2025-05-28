import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from './base.service';
import { Dish } from '../models/dish.model';
import { Observable, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DishService extends BaseService<Dish> {
  protected endpoint = 'dishes';

  constructor(protected override http: HttpClient) {
    super(http);
  }

  /**
   * Get dishes by site id
   */
  getBySiteId(siteId: number): Observable<Dish[]> {
    return this.http.get<Dish[]>(`${this.apiUrl}/${this.endpoint}/site/${siteId}`).pipe(
      catchError(this.handleError<Dish[]>('getBySiteId', []))
    );
  }
}
