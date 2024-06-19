import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginService } from '../service/login.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tela-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './tela-login.component.html',
  styleUrls: ['./tela-login.component.css']
})
export class TelaLoginComponent {

  form: FormGroup;
  mensagemSnackbarAcerto: string = 'Sucesso!';
  mensagemSnackbarErro: string = 'Erro ao acessar o sistema: usuário e/ou senha inválidos.';

  constructor(
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private loginService: LoginService,
    private router: Router
  ) {
    this.form = this.formBuilder.group({
      _id: [0],
      login: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    if (typeof localStorage !== 'undefined') {
      if (localStorage.getItem("auth-token")){
        localStorage.removeItem("auth-token");
        localStorage.removeItem("userName");
        localStorage.removeItem("role");
      }
    }
  }

  submit() {
    if (this.form.valid) {
      this.loginService.login(this.form.value.login, this.form.value.password).subscribe({
        next: (response: any) => this.onSuccess(response),
        error: () => this.onFailed()
      });
    } else {
      this.snackBar.open('Formulário inválido', '', { duration: 5000, panelClass: ['errorSnackbar'] });
    }
  }

  onSuccess(response: any) {
    this.snackBar.open(this.mensagemSnackbarAcerto, '', { duration: 5000, panelClass: ['successSnackbar'] });
    this.router.navigate(['/home']);
  }

  onFailed() {
    this.snackBar.open(this.mensagemSnackbarErro, '', { duration: 5000, panelClass: ['errorSnackbar'] });
  }

  showPassword() {
    const passwordField = document.getElementById('password') as HTMLInputElement;
    passwordField.type = 'text';
    const eyeIcon = document.getElementById('eyeIcon') as HTMLElement;
    eyeIcon.classList.add('dark');
    eyeIcon.textContent = 'visibility';
  }

  hidePassword() {
    const passwordField = document.getElementById('password') as HTMLInputElement;
    passwordField.type = 'password';
    const eyeIcon = document.getElementById('eyeIcon') as HTMLElement;
    eyeIcon.classList.remove('dark');
    eyeIcon.textContent = 'visibility_off';
  }
}
