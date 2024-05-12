import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { DisciplinaService } from '../service/disciplina.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Disciplina } from '../../../../models/Disciplina';
import { MatDialog } from '@angular/material/dialog';
import { ModalDialogComponent } from '../../../modal-dialog/modal-dialog.component';
import { Curso } from '../../../../models/Curso';
import { CursoService } from '../../curso/service/curso.service';

@Component({
  selector: 'app-cadastro-disciplina',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatTableModule
  ],
  templateUrl: './cadastro-disciplina.component.html',
  styleUrl: './cadastro-disciplina.component.css'
})
export class CadastroDisciplinaComponent implements OnInit {

  form: FormGroup;
  mensagemSnackbarAcerto: string = 'Disciplina cadastrada com sucesso.';
  mensagemSnackbarErro: string = 'Erro ao cadastrar disciplina.';
  cursos: Curso[] = [];

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private service: DisciplinaService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private cursoService: CursoService
  )

  {
    this.form = this.formBuilder.group({
      id: [0],
      name: '',
      acronym: '',
      course: null
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
  }

  onSubmit() {
    const selectedCourse = this.cursos.find(obj => obj._id == this.form.value.course);

    if (selectedCourse) {
        this.form.patchValue({ course: selectedCourse });
    }

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
        this.form.get('name')?.setValue('');
        this.form.get('course')?.setValue('');
        this.form.get('acronym')?.setValue('');
      } else {
        this.router.navigate(['/cadastro-gerencia/gerencia-disciplina']);
      }
    });
  }
}
