import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { Disciplina } from '../../../../models/Disciplina';
import { Professor } from '../../../../models/Professor';
import { Semestre } from '../../../../models/Semestre';
import { ActivatedRoute, Router } from '@angular/router';
import { AulaService } from '../service/aula.service';
import { DisciplinaService } from '../../../cadastro-gerencia/disciplina/service/disciplina.service';
import { ProfessorService } from '../../../cadastro-gerencia/professor/service/professor.service';
import { SemestreService } from '../../../cadastro-gerencia/semestre/service/semestre.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Aula } from '../../../../models/Aula';
import { ModalDialogComponent } from '../../../modal-dialog/modal-dialog.component';

@Component({
  selector: 'app-cadastro-aula',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatTableModule
  ],
  templateUrl: './cadastro-aula.component.html',
  styleUrl: './cadastro-aula.component.css'
})
export class CadastroAulaComponent {

  form: FormGroup;
  mensagemSnackbarAcerto: string = 'Aula cadastrada com sucesso.';
  mensagemSnackbarErro: string = 'Erro ao cadastrar aula.';
  disciplinas: Disciplina[] = [];
  professores: Professor[] = [];
  semestres: Semestre[] = [];

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private disciplinaService: DisciplinaService,
    private professorService: ProfessorService,
    private semestreService: SemestreService,
    private aulaService: AulaService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  )

  {
    this.form = this.formBuilder.group({
      _id: [0],
      discipline: new FormControl(''),
      teacher: new FormControl(''),
      semester: new FormControl(''),
      students: null,
      allocated: false
    });
  }

  ngOnInit(): void {
    this.disciplinaService.listar().subscribe(disciplinas => {
      this.disciplinas = disciplinas;
    });

    this.professorService.listar().subscribe(professores => {
      this.professores = professores;
    });

    this.semestreService.listar().subscribe(semestres => {
      this.semestres = semestres;
    });

    const obj: Aula = this.route.snapshot.data['aula'];

    if (obj) {
      this.form.setValue({
        _id: obj._id,
        discipline: obj.discipline,
        teacher: obj.teacher,
        semester: obj.semester,
        students: null,
        allocated: obj.allocated
      });
    }
  }

  onSubmit() {
    const selectedDiscipline = this.disciplinas.find(obj => obj._id == this.form.value.discipline);
    const selectedTeacher = this.professores.find(obj => obj._id == this.form.value.teacher);
    const selectedSemester = this.semestres.find(obj => obj._id == this.form.value.semester);

    if (selectedDiscipline && selectedTeacher && selectedSemester) {
      this.form.patchValue({ discipline: selectedDiscipline });
      this.form.patchValue({ teacher: selectedTeacher });
      this.form.patchValue({ semester: selectedSemester });
    }

    this.aulaService.save(this.form.value).subscribe(
      result => {
        const dialogData = {
          title: 'Aula Cadastrada',
          message: `A aula foi cadastrada.`,
          buttons: {
            cadastrarNovo: 'Cadastrar Nova Aula',
            irParaGerencia: 'Ver Aulas Cadastradas'
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
      this.router.navigate(['/alocar-local']);
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
        this.form.get('discipline')?.setValue('');
        this.form.get('teacher')?.setValue('');
        this.form.get('semester')?.setValue('');
        this.form.get('allocated')?.setValue(false);
      } else {
        this.router.navigate(['/alocar-local/gerencia-aula']);
      }
    });
  }

}
