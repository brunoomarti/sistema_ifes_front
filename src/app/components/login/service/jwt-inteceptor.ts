import {  HttpInterceptorFn } from '@angular/common/http';

export const JwtInterceptor: HttpInterceptorFn = (req, next) => {
    if (typeof localStorage !== 'undefined') {
        let token = localStorage.getItem('auth-token');
        if (token) {
            req = req.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`
                }
            });
        }
    }
    
    return next(req);
}