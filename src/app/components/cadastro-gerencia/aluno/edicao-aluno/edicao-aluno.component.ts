import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { AlunoService } from '../service/aluno.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { ReloadService } from '../../../../shared-services/reload.service';
import { Aluno } from '../../../../models/Aluno';

@Component({
  selector: 'app-edicao-aluno',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatIcon
  ],
  templateUrl: './edicao-aluno.component.html',
  styleUrl: './edicao-aluno.component.css'
})
export class EdicaoAlunoComponent implements OnInit {

  form: FormGroup;
  mensagemSnackbarAcerto: string = 'Aluno editado com sucesso.';
  mensagemSnackbarErro: string = 'Erro ao editar aluno.';

  constructor(
    public dialogRef: MatDialogRef<EdicaoAlunoComponent>,
    private formBuilder: FormBuilder,
    private service: AlunoService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private reloadService: ReloadService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  )

  {
    this.form = this.formBuilder.group({
      _id: 0,
      name: '',
      studentCode: ''
    });
  }

  ngOnInit(): void {
    const obj: Aluno = this.data.aluno;
    if (obj) {
      this.form.setValue({
        _id: obj._id,
        name: obj.name,
        studentCode: obj.studentCode
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
