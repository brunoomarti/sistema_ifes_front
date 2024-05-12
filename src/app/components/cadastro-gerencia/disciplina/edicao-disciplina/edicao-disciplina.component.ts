import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { DisciplinaService } from '../service/disciplina.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { ReloadService } from '../../../../shared-services/reload.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Disciplina } from '../../../../models/Disciplina';
import { CursoService } from '../../curso/service/curso.service';
import { Curso } from '../../../../models/Curso';

@Component({
  selector: 'app-edicao-disciplina',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatIcon
  ],
  templateUrl: './edicao-disciplina.component.html',
  styleUrl: './edicao-disciplina.component.css'
})
export class EdicaoDisciplinaComponent implements OnInit {

  form: FormGroup;
  mensagemSnackbarAcerto: string = 'Disciplina editada com sucesso.';
  mensagemSnackbarErro: string = 'Erro ao editar disciplina.';
  cursos: Curso[] = [];

  constructor(
    public dialogRef: MatDialogRef<EdicaoDisciplinaComponent>,
    private formBuilder: FormBuilder,
    private service: DisciplinaService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private reloadService: ReloadService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private cursoService: CursoService
  )

  {
    this.form = this.formBuilder.group({
      _id: 0,
      name: '',
      acronym: '',
      course: null
    });
  }

  ngOnInit(): void {
    const obj: Disciplina = this.data.disciplina;
    if (obj) {
      this.form.setValue({
        _id: obj._id,
        name: obj.name,
        acronym: obj.acronym,
        course: obj.course
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
    this.reloadService.triggerReload();
    this.dialogRef.close();
  }

  onFailed() {
    this.snackBar.open(this.mensagemSnackbarErro, '', { duration: 5000, panelClass: ['errorSnackbar'] });
    this.dialogRef.close();
  }

}
