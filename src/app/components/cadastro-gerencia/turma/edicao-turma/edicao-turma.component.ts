import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { TurmaService } from '../service/turma.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { ReloadService } from '../../../../shared-services/reload.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Turma } from '../../../../models/Turma';

@Component({
  selector: 'app-edicao-turma',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatIcon
  ],
  templateUrl: './edicao-turma.component.html',
  styleUrl: './edicao-turma.component.css'
})
export class EdicaoTurmaComponent implements OnInit {

  form: FormGroup;
  mensagemSnackbarAcerto: string = 'Turma editada com sucesso.';
  mensagemSnackbarErro: string = 'Erro ao editar turma.';

  constructor(
    public dialogRef: MatDialogRef<EdicaoTurmaComponent>,
    private formBuilder: FormBuilder,
    private service: TurmaService,
    private snackBar: MatSnackBar,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any,
  )

  {
    this.form = this.formBuilder.group({
      _id: 0,
      name: ''
    });
  }

  ngOnInit(): void {
    const obj: Turma = this.data.turma;;
    if (obj) {
      this.form.setValue({
        _id: obj._id,
        name: obj.name
      });
    }
  }

  onSubmit() {
    console.log(this.form.value);
    this.service.save(this.form.value).subscribe(result => this.onSucess(), error => this.onFailed());
    window.location.reload();
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSucess() {
    this.snackBar.open(this.mensagemSnackbarAcerto, '', { duration: 5000, panelClass: ['successSnackbar'] });
    this.dialogRef.close();
  }

  onFailed() {
    this.snackBar.open(this.mensagemSnackbarErro, '', { duration: 5000, panelClass: ['errorSnackbar'] });
    this.dialogRef.close();
  }

}
