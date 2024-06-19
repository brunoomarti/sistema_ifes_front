import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private tokenService: TokenService) {}

  canActivate(): boolean | UrlTree {
    const token = this.getToken();
    const isValid = token && this.tokenService.validateToken(token);

    if (isValid) {
      return true;
    } else {
      this.clearLocalStorage();
      return this.router.parseUrl('/login');
    }
  }

  private getToken(): string | null {
    if (this.isLocalStorageAvailable()) {
      return localStorage.getItem('auth-token');
    }
    return null;
  }

  private isLocalStorageAvailable(): boolean {
    try {
      const test = '__localStorageTest__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  }

  private clearLocalStorage(): void {
    if (this.isLocalStorageAvailable()) {
      localStorage.removeItem('token');
      localStorage.removeItem('userName');
    }
  }
}
