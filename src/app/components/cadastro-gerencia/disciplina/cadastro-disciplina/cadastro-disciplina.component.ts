import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { DisciplinaService } from '../service/disciplina.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Disciplina } from '../../../../models/Disciplina';
import { MatDialog } from '@angular/material/dialog';
import { ModalDialogComponent } from '../../../modal-dialog/modal-dialog.component';
import { Curso } from '../../../../models/Curso';
import { CursoService } from '../../curso/service/curso.service';
import { ModalDialogOkComponent } from '../../../modal-dialog/modal-dialog-ok/modal-dialog-ok.component';

@Component({
  selector: 'app-cadastro-disciplina',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatTableModule
  ],
  templateUrl: './cadastro-disciplina.component.html',
  styleUrls: ['./cadastro-disciplina.component.css']
})
export class CadastroDisciplinaComponent implements OnInit {

  form: FormGroup;
  mensagemSnackbarAcerto: string = 'Disciplina cadastrada com sucesso.';
  mensagemSnackbarErro: string = 'Erro ao cadastrar disciplina.';
  cursos: Curso[] = [];
  disciplinas: Disciplina[] = [];

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private service: DisciplinaService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private cursoService: CursoService
  ) {
    this.form = this.formBuilder.group({
      id: [0],
      name: ['', Validators.required],
      acronym: ['', Validators.required],
      course: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    const obj: Disciplina = this.route.snapshot.data['disciplina'];
    if (obj) {
      this.form.setValue({
        id: obj._id,
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
        this.form.patchValue({ course: selectedCourse });

        if (this.isDuplicate()) {
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
      } else {
        const missingFields = this.getMissingFields();
        const dialogDataForm = {
          title: 'Erro ao Cadastrar',
          message: `É necessário que os seguintes campos sejam preenchidos: ${missingFields.join('')}`,
        };
        this.openOkDialog(dialogDataForm);
      }
    }
  }

  getMissingFields(): string[] {
    const missingFields: string[] = [];

    if (this.form.get('name')?.hasError('required')) {
      missingFields.push('<li>Nome</li>');
    }
    if (this.form.get('acronym')?.hasError('required')) {
      missingFields.push('<li>Sigla (pelo menos 3 caracteres)</li>');
    } else if (this.form.get('acronym')?.value.length < 3) {
      missingFields.push('<li>Sigla (pelo menos 3 caracteres)</li>');
    } else if (this.form.get('acronym')?.value.length > 8) {
      missingFields.push('<li>Sigla (Máximo de 8 caracteres)</li>');
    }
    if (this.form.get('course')?.hasError('required')) {
      missingFields.push('<li>Selecione um Curso</li>');
    }

    return missingFields;
  }

  isDuplicate(): boolean {
    const selectedCourse = this.cursos.find(obj => obj._id == this.form.value.course);
    return this.disciplinas.some(disciplina => {
      return disciplina.name.toLowerCase() === this.form.get('name')?.value.toLowerCase() && disciplina.course._id === selectedCourse?._id;
    });
  }

  openOkDialog(data: any): void {
    this.dialog.open(ModalDialogOkComponent, {
      data: data,
      backdropClass: 'backdrop'
    });
  }

  save() {
    this.service.save(this.form.value).subscribe(
      result => {
        const dialogData = {
          title: 'Disciplina Cadastrada',
          message: `A disciplina ${result.name} foi cadastrada.`,
          buttons: {
            cadastrarNovo: 'Cadastrar Nova Disciplina',
            irParaGerencia: 'Ver Disciplinas Cadastradas'
          }
        };
        this.openDialog(dialogData);
      },
      error => {
        this.onFailed();
      }
    );
  }

  onCancel() {
    if (confirm('Tem certeza que deseja cancelar?')) {
      this.router.navigate(['/cadastro-gerencia']);
    }
  }

  onFailed() {
    this.snackBar.open(this.mensagemSnackbarErro, '', { duration: 5000, panelClass: ['errorSnackbar'] });
  }

  onSucess() {
    this.snackBar.open(this.mensagemSnackbarAcerto, '', { duration: 5000, panelClass: ['successSnackbar'] });
  }

  openDialog(data: any): void {
    const dialogRef = this.dialog.open(ModalDialogComponent, {
      data: data,
      disableClose: true,
      backdropClass: 'backdrop'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'cadastrarNovo') {
        this.form.reset();
      } else {
        this.router.navigate(['/cadastro-gerencia/gerencia-disciplina']);
      }
    });
  }
}
