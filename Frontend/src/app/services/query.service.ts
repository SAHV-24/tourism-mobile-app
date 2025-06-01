import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  FamosoTaggeado,
  UsuarioVisitas,
  PlatoTaggeado,
  PlatoPorUsuariosUnicos,
  TopSitio
} from '../models/queries.models';

@Injectable({ providedIn: 'root' })
export class QueryService {
  private api = '/api/queries';

  constructor(private http: HttpClient) {}

  getFamososMasTaggeados(): Observable<FamosoTaggeado[]> {
    return this.http.get<FamosoTaggeado[]>(`${this.api}/famosos-mas-taggeados`);
  }

  getUsuariosMasVisitas(): Observable<UsuarioVisitas[]> {
    return this.http.get<UsuarioVisitas[]>(`${this.api}/usuarios-mas-visitas`);
  }

  getPlatosPorUsuariosUnicos(n: number): Observable<PlatoPorUsuariosUnicos[]> {
    return this.http.get<PlatoPorUsuariosUnicos[]>(`${this.api}/platos-por-usuarios-unicos?n=${n}`);
  }

  getTopSitios(paisId?: string): Observable<TopSitio[]> {
    let url = `${this.api}/top-sitios`;
    if (paisId) url += `?paisId=${paisId}`;
    return this.http.get<TopSitio[]>(url);
  }

  getPlatosPorUbicacion(params: { paisId?: string; ciudadId?: string }): Observable<PlatoTaggeado[]> {
    let url = `${this.api}/platos-por-ubicacion`;
    const query = Object.entries(params)
      .filter(([_, v]) => v)
      .map(([k, v]) => `${k}=${v}`)
      .join('&');
    if (query) url += `?${query}`;
    return this.http.get<PlatoTaggeado[]>(url);
  }
}
