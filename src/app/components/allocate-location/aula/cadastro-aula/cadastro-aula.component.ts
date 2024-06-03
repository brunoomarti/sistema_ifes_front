import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
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
import { ModalDialogOkComponent } from '../../../modal-dialog/modal-dialog-ok/modal-dialog-ok.component';

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
  aulas: Aula[] = [];

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
      discipline: ['', Validators.required],
      teacher: ['', Validators.required],
      semester: ['', Validators.required],
      weeklyQuantity: ['0', [Validators.required, this.greaterThanZeroValidator()]],
      students: [null],
      allocated: [false]
    });
  }

  greaterThanZeroValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
        const valid = control.value > 0;
        return valid ? null : { 'greaterThanZero': { value: control.value } };
    };
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
        weeklyQuantity: obj.weeklyQuantity,
        students: null,
        allocated: obj.allocated
      });
    }
  }

  onSubmit() {
    if (this.form.invalid) {
        const missingFields = [];
        if (this.form.get('discipline')?.hasError('required')) {
            missingFields.push('<li>Disciplina</li>');
        }
        if (this.form.get('teacher')?.hasError('required')) {
            missingFields.push('<li>Professor</li>');
        }
        if (this.form.get('semester')?.hasError('required')) {
            missingFields.push('<li>Semestre</li>');
        }
        if (this.form.get('weeklyQuantity')?.hasError('required')) {
            missingFields.push('<li>Quantidade de aulas por semana</li>');
        }
        if (this.form.get('weeklyQuantity')?.value < 1) {
            missingFields.push('<li>A quantidade de aulas por semana deve ser maior que 0</li>');
        }
        const dialogDataForm = {
            title: 'Erro ao Cadastrar',
            message: `É necessário que os seguintes campos sejam preenchidos: ${missingFields.join('')}`,
        };
        this.openOkDialog(dialogDataForm);
    } else {
      const selectedDiscipline = this.disciplinas.find(obj => obj._id == this.form.value.discipline);
      const selectedTeacher = this.professores.find(obj => obj._id == this.form.value.teacher);
      const selectedSemester = this.semestres.find(obj => obj._id == this.form.value.semester);

      this.aulaService.listar().subscribe(aulas => {
        this.aulas = aulas;

        const exists = this.aulas.some(aula => aula.discipline._id === selectedDiscipline?._id && aula.teacher._id === selectedTeacher?._id && aula.semester._id === selectedSemester?._id);

        const errors: string[] = [];

        if (exists) {
            errors.push('A disciplina ' + selectedDiscipline?.name + ' já está sendo ministrada pelo professor ' + selectedTeacher?.name + ' no período ' + selectedSemester?.semester + '.');
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
    }
  }

  openOkDialog(data: any): void {
    this.dialog.open(ModalDialogOkComponent, {
      data: data,
      backdropClass: 'backdrop'
    });
  }

  save() {
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
        this.form.get('weeklyQuantity')?.setValue('0');
      } else {
        this.router.navigate(['/alocar-local/gerencia-aula']);
      }
    });
  }

}
