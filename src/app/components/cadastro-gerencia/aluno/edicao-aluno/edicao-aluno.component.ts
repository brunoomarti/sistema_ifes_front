import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { AlunoService } from '../service/aluno.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReloadService } from '../../../../shared-services/reload.service';
import { Aluno } from '../../../../models/Aluno';
import { Curso } from '../../../../models/Curso';
import { CursoService } from '../../curso/service/curso.service';

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
  cursos: Curso[] = [];

  constructor(
    public dialogRef: MatDialogRef<EdicaoAlunoComponent>,
    private formBuilder: FormBuilder,
    private service: AlunoService,
    private snackBar: MatSnackBar,
    private reloadService: ReloadService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private cursoService: CursoService
  )

  {
    this.form = this.formBuilder.group({
      _id: 0,
      name: '',
      course: null,
      studentCode: ''
    });
  }

  ngOnInit(): void {
    const obj: Aluno = this.data.aluno;
    if (obj) {
      this.form.setValue({
        _id: obj._id,
        name: obj.name,
        course: obj.course,
        studentCode: obj.studentCode
      });
    }

    this.cursoService.listar().subscribe(cursos => {
      this.cursos = cursos;
    });
  }

  onSubmit() {
    const selectedCourse = this.cursos.find(obj => obj._id == this.form.value.course);

    if (selectedCourse) {
        this.form.patchValue({ course: selectedCourse });
    }

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
