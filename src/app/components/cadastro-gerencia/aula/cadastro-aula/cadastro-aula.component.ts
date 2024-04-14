import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { Disciplina } from '../../../../models/Disciplina';
import { Professor } from '../../../../models/Professor';
import { Semestre } from '../../../../models/Semestre';
import { ActivatedRoute, Router } from '@angular/router';
import { AulaService } from '../service/aula.service';
import { DisciplinaService } from '../../disciplina/service/disciplina.service';
import { ProfessorService } from '../../professor/service/professor.service';
import { SemestreService } from '../../semestre/service/semestre.service';
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
      name: '',
      discipline: new FormControl(''),
      teacher: new FormControl(''),
      semester: new FormControl('')
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
        name: obj.name,
        discipline: obj.discipline,
        teacher: obj.teacher,
        semester: obj.semester
      });
    }
  }

  onSubmit() {
    const selectedDiscipline = this.disciplinas.find(obj => obj._id == this.form.value.discipline);
    const selectedTeacher = this.professores.find(obj => obj._id == this.form.value.teacher);
    const selectedSemester = this.semestres.find(obj => obj._id == this.form.value.semester);

    if (selectedDiscipline && selectedTeacher && selectedSemester) {
      this.form.patchValue({ coordination: selectedDiscipline });
      this.form.patchValue({ coordination: selectedTeacher });
      this.form.patchValue({ coordination: selectedSemester });
      this.form.patchValue([selectedDiscipline + ' (' + selectedTeacher.name + ')']);
    }

    console.log(this.form.value)

    this.aulaService.save(this.form.value).subscribe(
      result => {
        const dialogData = {
          title: 'Aula Cadastrada',
          message: `A aula ${result.name} foi cadastrada.`,
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
        this.form.get('discipline')?.setValue('');
        this.form.get('teacher')?.setValue('');
        this.form.get('semester')?.setValue('');
      } else {
        this.router.navigate(['/cadastro-gerencia/gerencia-aula']);
      }
    });
  }

}
