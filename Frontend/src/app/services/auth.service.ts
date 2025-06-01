import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import {
  BehaviorSubject,
  Observable,
  Subject,
  catchError,
  map,
  of,
  tap,
} from 'rxjs';
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
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(
    this.hasToken()
  );
  private usernameSubject = new BehaviorSubject<string>(
    this.getUsername() || ''
  );
  private userIdSubject = new BehaviorSubject<string | null>(this.getUserId());
  private userRoleSubject = new BehaviorSubject<string>(
    this.getUserRole() || ''
  );
  private logoutEvent = new Subject<void>();

  constructor(private router: Router, private http: HttpClient) {}

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
   * Get username from localStorage
   */
  private getUsername(): string | null {
    return localStorage.getItem('username');
  }

  /**
   * Get user ID from localStorage
   */
  private getUserId(): string | null {
    return localStorage.getItem('userId');
  }

  /**
   * Get user role from localStorage
   */
  private getUserRole(): string | null {
    return localStorage.getItem('userRole');
  }

  /**
   * Get username as Observable
   */
  getUsernameObservable(): Observable<string> {
    return this.usernameSubject.asObservable();
  }

  /**
   * Get user ID as Observable
   */
  getUserIdObservable(): Observable<string | null> {
    return this.userIdSubject.asObservable();
  }

  /**
   * Get user role as Observable
   */
  getUserRoleObservable(): Observable<string> {
    return this.userRoleSubject.asObservable();
  }

  /**
   * Get logout event as Observable
   */
  getLogoutEvent(): Observable<void> {
    return this.logoutEvent.asObservable();
  }

  /**
   * Get current username value
   */
  get currentUsername(): string {
    return this.usernameSubject.value;
  }

  /**
   * Get current user ID value
   */
  get currentUserId(): string | null {
    return this.userIdSubject.value;
  }

  /**
   * Get current user role value
   */
  get currentUserRole(): string {
    return this.userRoleSubject.value;
  }

  /**
   * Login with username and password
   */
  login(username: string, password: string): Observable<boolean> {
    return this.http
      .post<{ token: string; mensaje: string }>(
        `${this.apiUrl}/usuarios/login`,
        { usuario: username, contraseña: password }
      )
      .pipe(
        tap((response) => {
          if (response && response.token) {
            // Extract user information from JWT token
            const token = response.token;
            const tokenParts = token.split('.');
            if (tokenParts.length === 3) {
              try {
                const payload = JSON.parse(atob(tokenParts[1]));
                const userId = payload._id;
                const userUsername = payload.usuario;
                const userRole = payload.rol;

                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('token', response.token);
                localStorage.setItem('username', userUsername || username);
                localStorage.setItem('userId', userId);
                localStorage.setItem('userRole', userRole);

                this.isAuthenticatedSubject.next(true);
                this.usernameSubject.next(userUsername || username);
                this.userIdSubject.next(userId);
                this.userRoleSubject.next(userRole);
              } catch (e) {
                console.error('Error parsing JWT token:', e);
                return;
              }
            }
          }
        }),
        map((response) => !!response.token),
        catchError((error) => {
          console.error('Login failed:', error);
          return of(false);
        })
      );
  }

  /**
   * Register a new user (legacy method)
   */
  register(user: Partial<User>): Observable<boolean> {
    return this.http
      .post<{ success: boolean; user: User }>(
        `${this.apiUrl}/auth/register`,
        user
      )
      .pipe(
        map((response) => response.success),
        catchError((error) => {
          console.error('Registration failed:', error);
          return of(false);
        })
      );
  }

  /**
   * Sign up a new user using the new endpoint
   */
  signup(signupData: SignupRequest): Observable<boolean> {
    return this.http
      .post<any>(`${this.apiUrl}/usuarios/signup`, signupData)
      .pipe(
        map((response) => !!response),
        catchError((error) => {
          console.error('Signup failed:', error);
          return of(false);
        })
      );
  }

  /**
   * Logout user
   */
  logout(): Observable<boolean> {
    // Clear local auth data immediately to ensure UI updates
    this.clearAuthData();

    // Emit logout event
    this.logoutEvent.next();

    // Return success immediately since the API doesn't have a logout endpoint
    return of(true);
  }

  /**
   * Clear authentication data from localStorage and update subjects
   */
  private clearAuthData(): void {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');

    this.isAuthenticatedSubject.next(false);
    this.usernameSubject.next('');
    this.userIdSubject.next(null);
    this.userRoleSubject.next('');
    this.router.navigate(['/login']);
  }

  /**
   * Get the authentication token
   */
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  /**
   * Returns true if the current user is admin
   */
  isAdmin(): boolean {
    return (
      this.getUserRole()?.toLowerCase() === 'administrador' ||
      this.currentUserRole.toLowerCase() === 'administrador'
    );
  }
}
