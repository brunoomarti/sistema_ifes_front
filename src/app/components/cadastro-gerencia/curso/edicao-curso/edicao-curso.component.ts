import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { CursoService } from '../service/curso.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReloadService } from '../../../../shared-services/reload.service';
import { Curso } from '../../../../models/Curso';

@Component({
  selector: 'app-edicao-curso',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatIcon
  ],
  templateUrl: './edicao-curso.component.html',
  styleUrl: './edicao-curso.component.css'
})
export class EdicaoCursoComponent implements OnInit {

  form: FormGroup;
  mensagemSnackbarAcerto: string = 'Curso editado com sucesso.';
  mensagemSnackbarErro: string = 'Erro ao editar curso.';

  constructor(
    public dialogRef: MatDialogRef<EdicaoCursoComponent>,
    private formBuilder: FormBuilder,
    private service: CursoService,
    private snackBar: MatSnackBar,
    private reloadService: ReloadService,
    @Inject(MAT_DIALOG_DATA) public data: Curso,
  )

  {
    this.form = this.formBuilder.group({
      _id: 0,
      name: ''
    });
  }

  ngOnInit(): void {
    console.log(this.data);
    if (this.data) {
      this.form.setValue({
        _id: this.data.obj._id,
        name: this.data.obj.name
      });
    }
  }

  onSubmit() {
    console.log(this.form.value);
    this.service.save(this.form.value).subscribe(result => this.onSucess(), error => this.onFailed());
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSucess() {
    this.snackBar.open(this.mensagemSnackbarAcerto, '', { duration: 5000, panelClass: ['successSnackbar'] });
    this.dialogRef.close();
    this.reloadService.triggerReload();
  }

  onFailed() {
    this.snackBar.open(this.mensagemSnackbarErro, '', { duration: 5000, panelClass: ['errorSnackbar'] });
    this.dialogRef.close();
  }

}
