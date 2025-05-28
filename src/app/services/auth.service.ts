import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, map, of, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from '../models/user.model';

// Interface for signup request
export interface SignupRequest {
  nombre: string;
  apellido: string;
  correo: string;
  usuario: string;
  contraseña: string;
  rol: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
  private userEmailSubject = new BehaviorSubject<string>(this.getUserEmail() || '');
  private userIdSubject = new BehaviorSubject<number | null>(this.getUserId());

  constructor(
    private router: Router,
    private http: HttpClient
  ) {}

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  /**
   * Get current authentication value
   */
  get currentAuthValue(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  /**
   * Check if there is a token in localStorage
   */
  private hasToken(): boolean {
    return !!localStorage.getItem('isLoggedIn');
  }

  /**
   * Get user email from localStorage
   */
  private getUserEmail(): string | null {
    return localStorage.getItem('userEmail');
  }

  /**
   * Get user ID from localStorage
   */
  private getUserId(): number | null {
    const userId = localStorage.getItem('userId');
    return userId ? parseInt(userId, 10) : null;
  }

  /**
   * Get user email as Observable
   */
  getUserEmailObservable(): Observable<string> {
    return this.userEmailSubject.asObservable();
  }

  /**
   * Get user ID as Observable
   */
  getUserIdObservable(): Observable<number | null> {
    return this.userIdSubject.asObservable();
  }

  /**
   * Get current user email value
   */
  get currentUserEmail(): string {
    return this.userEmailSubject.value;
  }

  /**
   * Get current user ID value
   */
  get currentUserId(): number | null {
    return this.userIdSubject.value;
  }

  /**
   * Login with email and password
   */
  login(username: string, password: string): Observable<boolean> {
    return this.http.post<{token: string, user: User}>(`${this.apiUrl}/auth/login`, { username, password }).pipe(
      tap(response => {
        if (response && response.token) {
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('token', response.token);
          localStorage.setItem('userEmail', response.user.email);
          localStorage.setItem('userId', response.user.idUser.toString());

          this.isAuthenticatedSubject.next(true);
          this.userEmailSubject.next(response.user.email);
          this.userIdSubject.next(response.user.idUser);
        }
      }),
      map(response => !!response.token),
      catchError(error => {
        console.error('Login failed:', error);
        return of(false);
      })
    );
  }

  /**
   * Register a new user (legacy method)
   */
  register(user: Partial<User>): Observable<boolean> {
    return this.http.post<{success: boolean, user: User}>(`${this.apiUrl}/auth/register`, user).pipe(
      map(response => response.success),
      catchError(error => {
        console.error('Registration failed:', error);
        return of(false);
      })
    );
  }

  /**
   * Sign up a new user using the new endpoint
   */
  signup(signupData: SignupRequest): Observable<boolean> {
    return this.http.post<any>('/api/usuarios/signup', signupData).pipe(
      map(response => !!response),
      catchError(error => {
        console.error('Signup failed:', error);
        return of(false);
      })
    );
  }

  /**
   * Logout user
   */
  logout(): Observable<boolean> {
    // Call the logout endpoint if the API requires it
    return this.http.post<{success: boolean}>(`${this.apiUrl}/auth/logout`, {}).pipe(
      tap(() => {
        this.clearAuthData();
      }),
      map(response => response.success),
      catchError(error => {
        console.error('Logout failed:', error);
        // Still clear local auth data even if the API call fails
        this.clearAuthData();
        return of(true);
      })
    );
  }

  /**
   * Clear authentication data from localStorage and update subjects
   */
  private clearAuthData(): void {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userId');

    this.isAuthenticatedSubject.next(false);
    this.userEmailSubject.next('');
    this.userIdSubject.next(null);
    this.router.navigate(['/login']);
  }

  /**
   * Get the authentication token
   */
  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
