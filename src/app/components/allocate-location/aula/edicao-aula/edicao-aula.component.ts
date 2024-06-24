import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { Disciplina } from '../../../../models/Disciplina';
import { Professor } from '../../../../models/Professor';
import { Semestre } from '../../../../models/Semestre';
import { DisciplinaService } from '../../../cadastro-gerencia/disciplina/service/disciplina.service';
import { ProfessorService } from '../../../cadastro-gerencia/professor/service/professor.service';
import { SemestreService } from '../../../cadastro-gerencia/semestre/service/semestre.service';
import { AulaService } from '../service/aula.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Aula } from '../../../../models/Aula';
import { ReloadService } from '../../../../shared-services/reload.service';
import { CommonModule } from '@angular/common';
import { ModalDialogOkComponent } from '../../../modal-dialog/modal-dialog-ok/modal-dialog-ok.component';
import { Alocar } from '../../../../models/Alocar';
import { AllocateService } from '../../allocate-main/service/allocate.service';

@Component({
  selector: 'app-edicao-aula',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatIcon
  ],
  templateUrl: './edicao-aula.component.html',
  styleUrl: './edicao-aula.component.css'
})
export class EdicaoAulaComponent implements OnInit {

  form: FormGroup;
  mensagemSnackbarAcerto: string = 'Aula editada com sucesso.';
  mensagemSnackbarErro: string = 'Erro ao editar aula.';
  disciplinas: Disciplina[] = [];
  professores: Professor[] = [];
  semestres: Semestre[] = [];
  aulas: Aula[] = [];
  aulasAlocadasPorAula: Map<number, number> = new Map<number, number>();

  constructor(
    public dialogRef: MatDialogRef<EdicaoAulaComponent>,
    private formBuilder: FormBuilder,
    private disciplinaService: DisciplinaService,
    private professorService: ProfessorService,
    private semestreService: SemestreService,
    private aulaService: AulaService,
    private snackBar: MatSnackBar,
    private reloadService: ReloadService,
    private dialog: MatDialog,
    private allocateService: AllocateService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  )

  {
    this.form = this.formBuilder.group({
      _id: [0],
      discipline: ['', Validators.required],
      teacher: ['', Validators.required],
      semester: ['', Validators.required],
      weeklyQuantity: ['0', [Validators.required, this.greaterThanZeroValidator()]],
      students: null,
      allocated: false
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

    const obj: Aula = this.data.aula;
    if (obj) {
      this.form.setValue({
        _id: obj._id,
        discipline: obj.discipline,
        teacher: obj.teacher,
        semester: obj.semester,
        weeklyQuantity: obj.weeklyQuantity,
        students: obj.students,
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

            const existingAula = this.aulas.find(aula =>
                aula.discipline._id === selectedDiscipline?._id &&
                aula.teacher._id === selectedTeacher?._id &&
                aula.semester._id === selectedSemester?._id
            );

            const exists = !!existingAula;

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

  isLimiteMaximoAtingido(aula: Aula): boolean {
    const aulaId = aula._id;
    const aulasAlocadas = this.aulasAlocadasPorAula.get(aulaId) || 0;
    return aulasAlocadas > this.form.value.weeklyQuantity;

  }

  openOkDialog(data: any): void {
    this.dialog.open(ModalDialogOkComponent, {
      data: data,
      backdropClass: 'backdropTwo'
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

    delete this.form.value.teacher.authorities;

    this.form.value.students.forEach((student: any) => {
      delete student.authorities;
    });

    this.aulaService.save(this.form.value).subscribe(result => this.onSucess(), error => this.onFailed());
  }

  calcularAulasAlocadas(alocacoes: Alocar[], editedAulaId: number): number {
    let totalAllocatedLessons = 0;

    alocacoes.forEach(alocacao => {
        if (alocacao.lesson._id === editedAulaId) {
            totalAllocatedLessons += alocacao.selectedTimes.length;
        }
    });
    return totalAllocatedLessons;
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
