import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { AlunoService } from '../service/aluno.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReloadService } from '../../../../shared-services/reload.service';
import { Aluno } from '../../../../models/Aluno';
import { Curso } from '../../../../models/Curso';
import { CursoService } from '../../curso/service/curso.service';
import { ModalDialogOkComponent } from '../../../modal-dialog/modal-dialog-ok/modal-dialog-ok.component';

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
  currentYear: number;

  constructor(
    public dialogRef: MatDialogRef<EdicaoAlunoComponent>,
    private formBuilder: FormBuilder,
    private service: AlunoService,
    private snackBar: MatSnackBar,
    private reloadService: ReloadService,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private cursoService: CursoService
  )

  {
    this.currentYear = new Date().getFullYear();

    this.form = this.formBuilder.group({
      _id: 0,
      name: [''],
      registrationYear: ['', [Validators.required, Validators.min(1960), Validators.max(this.currentYear)]],
      course: null,
      studentCode: ['']
    });
  }

  ngOnInit(): void {
    const obj: Aluno = this.data.aluno;
    if (obj) {
      this.form.setValue({
        _id: obj._id,
        name: obj.name,
        registrationYear: obj.registrationYear,
        course: obj.course,
        studentCode: obj.studentCode
      });
    }

    this.cursoService.listar().subscribe(cursos => {
      this.cursos = cursos;
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      const missingFields = [];
      if (this.form.get('name')?.hasError('required')) {
        missingFields.push('<li>Nome</li>');
      }
      const selectedCourse = this.cursos.find(obj => obj._id == this.form. value.course);
      if (!selectedCourse) {
        missingFields.push('<li>Curso</li>');
      }
      if (this.form.get('registrationYear')?.hasError('required')) {
        missingFields.push('<li>Ano de matrícula</li>');
      }
      const dialogDataForm = {
        title: 'Erro ao Cadastrar',
        message: `É necessário que os seguintes campos sejam preenchidos: ${missingFields.join('')}`,
      };

      this.dialog.open(ModalDialogOkComponent, {
        data: dialogDataForm,
        backdropClass: 'backdropTwo'
      });
    } else {
      this.save();
    }
  }

  save() {
    const selectedCourse = this.cursos.find(obj => obj._id == this.form.value.course);

    if (selectedCourse) {
        this.form.patchValue({ course: selectedCourse });
    }

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
