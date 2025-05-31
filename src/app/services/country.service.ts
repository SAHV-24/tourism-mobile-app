import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from './base.service';
import { Country } from '../models/country.model';

@Injectable({
  providedIn: 'root'
})
export class CountryService extends BaseService<Country> {
  protected endpoint = 'paises';

  constructor(protected override http: HttpClient) {
    super(http);
  }
}
