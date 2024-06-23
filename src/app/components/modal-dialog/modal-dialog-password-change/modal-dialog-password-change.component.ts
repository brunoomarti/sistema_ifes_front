import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { LoginService } from '../../login/service/login.service';
import { ModalDialogOkComponent } from '../modal-dialog-ok/modal-dialog-ok.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal-dialog-password-change',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './modal-dialog-password-change.component.html',
  styleUrls: ['./modal-dialog-password-change.component.css']
})
export class ModalDialogPasswordChangeComponent {
  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private loginService: LoginService,
    private dialogSuccess: MatDialog,
    public dialogRef: MatDialogRef<ModalDialogPasswordChangeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = this.formBuilder.group({
      _id: [0],
      login: ['', Validators.required],
      passwordOne: ['', [Validators.required, Validators.minLength(6), Validators.pattern('^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{6,}$')]],
      passwordTwo: ['', Validators.required]
    });
  }

  cancel(): void {
    this.dialogRef.close();
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (this.form.get('passwordOne')?.value !== this.form.get('passwordTwo')?.value) {
      this.form.get('passwordTwo')?.setErrors({ mismatch: true });
      return;
    }

    this.loginService.login(this.form.value.login, this.form.value.passwordOne).subscribe({
      next: (response: any) => {
        this.dialogRef.close();
        this.openModalOk('Senha alterada com sucesso!');
      },
      error: () => {
        this.dialogRef.close();
        this.openModalOk('Falha ao alterar a senha.');
      }
    });
  }

  openModalOk(message: string): void {
    this.dialogSuccess.open(ModalDialogOkComponent, {
      data: { message },
      backdropClass: 'backdropTwo'
    });
  }

  showPassword(fieldId: string) {
    const passwordField = document.getElementById(fieldId) as HTMLInputElement;
    const eyeIcon = fieldId === 'passwordOne' ? document.getElementById('eyeIconOne') as HTMLElement : document.getElementById('eyeIconTwo') as HTMLElement;
    passwordField.type = 'text';
    eyeIcon.textContent = 'visibility';
  }

  hidePassword(fieldId: string) {
    const passwordField = document.getElementById(fieldId) as HTMLInputElement;
    const eyeIcon = fieldId === 'passwordOne' ? document.getElementById('eyeIconOne') as HTMLElement : document.getElementById('eyeIconTwo') as HTMLElement;
    passwordField.type = 'password';
    eyeIcon.textContent = 'visibility_off';
  }
}
