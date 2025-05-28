import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable()
export abstract class BaseService<T> {
  protected apiUrl = environment.apiUrl;
  protected abstract endpoint: string;

  constructor(protected http: HttpClient) {}

  /**
   * Get all items
   */
  getAll(): Observable<T[]> {
    return this.http.get<T[]>(`${this.apiUrl}/${this.endpoint}`).pipe(
      catchError(this.handleError<T[]>('getAll', []))
    );
  }

  /**
   * Get item by id
   */
  getById(id: number): Observable<T> {
    return this.http.get<T>(`${this.apiUrl}/${this.endpoint}/${id}`).pipe(
      catchError(this.handleError<T>('getById'))
    );
  }

  /**
   * Create new item
   */
  create(item: T): Observable<T> {
    return this.http.post<T>(`${this.apiUrl}/${this.endpoint}`, item).pipe(
      catchError(this.handleError<T>('create'))
    );
  }

  /**
   * Update existing item
   */
  update(id: number, item: T): Observable<T> {
    return this.http.put<T>(`${this.apiUrl}/${this.endpoint}/${id}`, item).pipe(
      catchError(this.handleError<T>('update'))
    );
  }

  /**
   * Delete item
   */
  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${this.endpoint}/${id}`).pipe(
      catchError(this.handleError('delete'))
    );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  protected handleError<T>(operation = 'operation', result?: T) {
    return (error: HttpErrorResponse): Observable<T> => {
      // Log the error to console with more details
      console.error(`${operation} failed:`, error);

      // Create a more descriptive error message
      let errorMessage = `Operation ${operation} failed`;

      // Add more specific error information if available
      if (error.error instanceof ErrorEvent) {
        // Client-side error
        errorMessage += `: ${error.error.message}`;
      } else {
        // Server-side error
        errorMessage += `: ${error.status} ${error.statusText}`;
        if (error.error && error.error.message) {
          errorMessage += ` - ${error.error.message}`;
        }
      }

      // Store the error message in a custom property on the error object for components to access
      (error as any).customMessage = errorMessage;

      // Let the app keep running by returning an empty result or a default value
      return of(result as T);
    };
  }
}
