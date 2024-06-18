import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { DisciplinaService } from '../service/disciplina.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { ReloadService } from '../../../../shared-services/reload.service';
import { Disciplina } from '../../../../models/Disciplina';
import { CursoService } from '../../curso/service/curso.service';
import { Curso } from '../../../../models/Curso';
import { ModalDialogOkComponent } from '../../../modal-dialog/modal-dialog-ok/modal-dialog-ok.component';

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
  disciplinas: Disciplina[] = [];

  constructor(
    public dialogRef: MatDialogRef<EdicaoDisciplinaComponent>,
    private formBuilder: FormBuilder,
    private service: DisciplinaService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private reloadService: ReloadService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private cursoService: CursoService
  )

  {
    this.form = this.formBuilder.group({
      _id: 0,
      name: ['', Validators.required],
      acronym: ['', Validators.required],
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

    this.service.listar().subscribe(disciplinas => {
      this.disciplinas = disciplinas;
    });
  }

  onSubmit() {
    const selectedCourse: Curso | undefined = this.cursos.find(obj => obj._id == this.form.value.course);

    if (!selectedCourse) {
      throw new Error('Curso não encontrado');
    } else {
      const errors: string[] = [];

      if (this.form.valid) {
        if (selectedCourse) {
            this.form.patchValue({ course: selectedCourse });
        }

        this.service.listar().subscribe(disciplinas => {
          this.disciplinas = disciplinas;

          const currentDisciplineId = this.form.get('_id')?.value;

          const duplicate = this.disciplinas.some(disciplina => {
            const isDuplicate = disciplina.name.toLowerCase() === this.form.get('name')?.value.toLowerCase() &&
                                disciplina.course._id === selectedCourse._id &&
                                disciplina._id !== currentDisciplineId;
            return isDuplicate;
          });

          if (duplicate) {
              errors.push('Já existe uma disciplina destinada a esse curso.');
          }

          if (errors.length > 0) {
              const dialogData = {
                  title: 'Erro ao Cadastrar',
                  message: errors.join('<br>')
              };
              this.openOkDialog(dialogData);
          } else {
              this.save();
          }
        });
      } else {
        const missingFields = [];

        if (this.form.get('name')?.hasError('required')) {
          missingFields.push('<li>Nome</li>');
        }
        if (this.form.get('acronym')?.hasError('required')) {
          missingFields.push('<li>Sigla (pelo menos 3 caracteres)</li>');
        } else if (this.form.get('acronym')?.value.length < 3) {
          missingFields.push('<li>Sigla (pelo menos 3 caracteres)</li>');
        } else if (this.form.get('acronym')?.value.length > 8) {
          missingFields.push('<li>Sigla (Máximo de 8 caracteres) </li>');
        }

        if (this.form.get('course')?.hasError('required')) {
          missingFields.push('<li>Selecione um Curso</li>');
        }

        const dialogDataForm = {
          title: 'Erro ao Cadastrar',
          message: `É necessário que os seguintes campos sejam preenchidos: ${missingFields.join('')}`,
        };

        this.openOkDialog(dialogDataForm);
      }
    }
  }

  openOkDialog(data: any): void {
    this.dialog.open(ModalDialogOkComponent, {
      data: data,
      backdropClass: 'backdropTwo'
    });
  }

  save() {
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
