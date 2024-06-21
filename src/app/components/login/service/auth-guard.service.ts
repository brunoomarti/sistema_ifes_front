import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if (typeof localStorage !== 'undefined') {
      const authToken = localStorage.getItem('auth-token');
      const userRole = localStorage.getItem('role');
      if (authToken && userRole) {
        if (userRole === 'ADMIN' || userRole === 'COORDINATOR') {
          return true;
        } else if (userRole === 'STUDENT') {
          const allowedRoutes = ['/home', '/horarios'];
          if (allowedRoutes.includes(state.url)) {
            return true;
          } else {
            this.router.navigate(['/home']);
            return false;
          }
        } else if (userRole === 'TEACHER') {
          const allowedRoutes = ['/home', '/horarios', '/alocar-local/gerencia-aula', '/alocar-local'];
          if (allowedRoutes.includes(state.url)) {
            return true;
          } else {
            this.router.navigate(['/home']);
            return false;
          }
        }
      }
  
    }
    this.router.navigate(['/login']);
    return false;
  }
}
