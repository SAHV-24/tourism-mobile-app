import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from './base.service';
import { City } from '../models/city.model';
import { Observable, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CityService extends BaseService<City> {
  protected endpoint = 'ciudades';

  constructor(protected override http: HttpClient) {
    super(http);
  }

  /**
   * Get cities by country id
   */
  getByCountryId(countryId: number | string): Observable<City[]> {
    return this.http.get<City[]>(`${this.apiUrl}/${this.endpoint}/pais/${countryId.toString()}`).pipe(
      catchError(this.handleError<City[]>('getByCountryId', []))
    );
  }
}
