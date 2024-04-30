import { CommonModule, DatePipe } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { Aluno } from '../../../../models/Aluno';
import { ActivatedRoute, Router } from '@angular/router';
import { AulaService } from '../service/aula.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AlunoService } from '../../../cadastro-gerencia/aluno/service/aluno.service';
import { Aula } from '../../../../models/Aula';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-matricular-aluno-aula',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatTableModule
  ],
  templateUrl: './matricular-aluno-aula.component.html',
  styleUrl: './matricular-aluno-aula.component.css',
  providers: [DatePipe]
})
export class MatricularAlunoAulaComponent {

  form: FormGroup;
  mensagemSnackbarAcerto: string = 'Aluno matriculado com sucesso.';
  mensagemSnackbarErro: string = 'Erro ao matricular aluno.';
  alunos: Aluno[] = [];
  indexAlunos: number[] = [];
  selectedStudents: Aluno[] = [];

  constructor(
    public dialogRef: MatDialogRef<MatricularAlunoAulaComponent>,
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private service: AulaService,
    private alunoService: AlunoService,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any,
  )

  {
    this.form = this.formBuilder.group({
      _id: [0],
      discipline: null,
      teacher: null,
      semester: null,
      weeklyQuantity: 0,
      students: [],
      allocated: null
    });
  }

  ngOnInit(): void {
    this.alunoService.listar().subscribe((alunos: Aluno[]) => {
      if (this.data && this.data.aula && this.data.aula.students) {
        const alunoIdsMatriculados = this.data.aula.students.map((aluno: Aluno) => aluno._id);
        this.alunos = alunos.filter((aluno: Aluno) => !alunoIdsMatriculados.includes(aluno._id));
      } else {
        this.alunos = alunos;
      }
    });

    const obj: Aula = this.data.aula;
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
    this.indexAlunos.forEach(id => {
      const selectedStudent = this.alunos.find(obj => obj._id == id);
      console.log(selectedStudent);
      if (selectedStudent){
        this.selectedStudents.push(selectedStudent);
      }
    })

    const mergedStudents = [...this.selectedStudents, ...this.data.aula.students];

    this.form.patchValue({ students: mergedStudents })

    console.log(this.form.value);

    this.service.save(this.form.value).subscribe(result => this.onSucess(), error => this.onFailed());
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSucess() {
    this.snackBar.open(this.mensagemSnackbarAcerto, '', { duration: 5000, panelClass: ['successSnackbar'] });
    this.dialogRef.close();
  }

  onFailed() {
    this.snackBar.open(this.mensagemSnackbarErro, '', { duration: 5000, panelClass: ['errorSnackbar'] });
    this.dialogRef.close();
  }

  onCheckboxChange(event: any, aluno: any) {
    if (event.target.checked) {
      this.indexAlunos.push(aluno._id);
    } else {
      const index = this.indexAlunos.indexOf(aluno._id);
      if (index !== -1) {
        this.indexAlunos.splice(index, 1);
      }
    }
    console.log(this.indexAlunos);
  }
}
