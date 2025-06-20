import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from './base.service';
import { User } from '../models/user.model';
import { Observable, catchError } from 'rxjs';
import { UserRoleEnum } from '../models/enums';

@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseService<User> {
  protected endpoint = 'usuarios';

  constructor(protected override http: HttpClient) {
    super(http);
  }

  /**
   * Get users by role
   */
  getByRole(role: UserRoleEnum): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/${this.endpoint}/role/${role}`).pipe(
      catchError(this.handleError<User[]>('getByRole', []))
    );
  }

  /**
   * Change user password
   */
  changePassword(userId: string, oldPassword: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${this.endpoint}/${userId}/change-password`, {
      oldPassword,
      newPassword
    }).pipe(
      catchError(this.handleError<any>('changePassword'))
    );
  }

  /**
   * Crear usuario usando el endpoint correcto /api/usuarios/signup
   */
  override create(item: User): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/${this.endpoint}/signup`, item).pipe(
      catchError(this.handleError<User>('create'))
    );
  }
}
