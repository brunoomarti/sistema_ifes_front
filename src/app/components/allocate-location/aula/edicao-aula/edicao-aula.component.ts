import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { Disciplina } from '../../../../models/Disciplina';
import { Professor } from '../../../../models/Professor';
import { Semestre } from '../../../../models/Semestre';
import { DisciplinaService } from '../../../cadastro-gerencia/disciplina/service/disciplina.service';
import { ProfessorService } from '../../../cadastro-gerencia/professor/service/professor.service';
import { SemestreService } from '../../../cadastro-gerencia/semestre/service/semestre.service';
import { AulaService } from '../service/aula.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Aula } from '../../../../models/Aula';
import { ReloadService } from '../../../../shared-services/reload.service';
import { CommonModule } from '@angular/common';

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

  constructor(
    public dialogRef: MatDialogRef<EdicaoAulaComponent>,
    private formBuilder: FormBuilder,
    private disciplinaService: DisciplinaService,
    private professorService: ProfessorService,
    private semestreService: SemestreService,
    private aulaService: AulaService,
    private snackBar: MatSnackBar,
    private reloadService: ReloadService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  )

  {
    this.form = this.formBuilder.group({
      _id: [0],
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

    const obj: Aula = this.data.aula;
    if (obj) {
      this.form.setValue({
        _id: obj._id,
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
      this.form.patchValue({ discipline: selectedDiscipline });
      this.form.patchValue({ teacher: selectedTeacher });
      this.form.patchValue({ semester: selectedSemester });
      this.form.patchValue([selectedDiscipline + ' (' + selectedTeacher.name + ')']);
    }

    console.log(this.form.value)

    this.aulaService.save(this.form.value).subscribe(result => this.onSucess(), error => this.onFailed());
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
