import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
  styleUrl: './tela-login.component.css'
})
export class TelaLoginComponent {

  form: FormGroup;
  mensagemSnackbarAcerto: string = 'Sucesso!';
  mensagemSnackbarErro: string = 'Erro ao acessar o sistema usuario e senha inválidos.';

  constructor(
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private loginService: LoginService,
    private router: Router
  )

  {
    this.isLoggedIn();

    this.form = this.formBuilder.group({
      _id: [0],
      login: '',
      password: new FormControl('', [Validators.required, Validators.minLength(6)])
    });
  }

  submit(){
    this.loginService.login(this.form.value.login, this.form.value.password).subscribe({
      next: () => this.onSuccess(),
      error: () => this.onFailed()
    })
    
  }

  isLoggedIn(): void{
    if (typeof localStorage!== 'undefined') {
      if (localStorage.getItem('auth-token')){
        this.router.navigate(['/home']);
      }
    } else {
      this.router.navigate(['/login']);
    }
  }

  onSuccess() {
    this.snackBar.open(this.mensagemSnackbarAcerto, '', { duration: 5000, panelClass: ['successSnackbar'] });
    this.router.navigate(['/home']);
  }

  onFailed() {
    this.snackBar.open(this.mensagemSnackbarErro, '', { duration: 5000, panelClass: ['errorSnackbar'] });
  }

}
