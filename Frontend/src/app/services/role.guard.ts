import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    // First check if the user is authenticated
    if (!this.authService.currentAuthValue) {
      console.error('Access denied: User is not authenticated');
      this.router.navigate(['/login']);
      return false;
    }

    // Check if the user has the required role
    const requiredRole = route.data['requiredRole'] as string;
    const userRole = this.authService.currentUserRole;

    if (requiredRole && userRole !== requiredRole) {
      console.error(`Access denied: Required role '${requiredRole}', user role '${userRole}'`);
      this.router.navigate(['/folder/home']);
      return false;
    }

    console.log(`Access granted: User has role '${userRole}'`);
    return true;
  }
}
