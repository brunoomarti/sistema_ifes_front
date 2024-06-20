import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginResponse } from '../../../models/types/login-response.type';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private readonly API = 'api/auth';

  constructor(private httpClient: HttpClient) { }

  login(login: string, password: string){
    return this.httpClient.post<LoginResponse>(this.API + "/login", { login, password }).pipe(
      tap((value) => {
        localStorage.setItem("auth-token", value.token)
        localStorage.setItem("username", value.name)
        localStorage.setItem("role", value.role)
        localStorage.setItem("user_code", value.user_code)
      })
    )
  }
}
