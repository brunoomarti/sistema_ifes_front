import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let routerSpy = { navigate: jasmine.createSpy('navigate'), parseUrl: jasmine.createSpy('parseUrl') };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: Router, useValue: routerSpy }
      ]
    });
    guard = TestBed.inject(AuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should return true for a logged-in user', () => {
    spyOn(localStorage, 'getItem').and.returnValue('fake-jwt-token');
    expect(guard.canActivate()).toBe(true);
  });

  it('should return UrlTree for a not logged-in user', () => {
    spyOn(localStorage, 'getItem').and.returnValue(null);
    const result = guard.canActivate();
    expect(result).toEqual(routerSpy.parseUrl('/login'));
  });
});
