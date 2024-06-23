import { CommonModule, DatePipe } from '@angular/common';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { SelectionModel } from '@angular/cdk/collections';
import { Aluno } from '../../../../models/Aluno';
import { ActivatedRoute, Router } from '@angular/router';
import { AulaService } from '../service/aula.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AlunoService } from '../../../cadastro-gerencia/aluno/service/aluno.service';
import { Aula } from '../../../../models/Aula';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-matricular-aluno-aula',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatPaginator,
    MatTableModule,
    MatCheckboxModule
  ],
  templateUrl: './matricular-aluno-aula.component.html',
  styleUrls: ['./matricular-aluno-aula.component.css'],
  providers: [DatePipe]
})
export class MatricularAlunoAulaComponent implements OnInit {

  form: FormGroup;
  mensagemSnackbarAcerto: string = 'Aluno matriculado com sucesso.';
  mensagemSnackbarErro: string = 'Erro ao matricular aluno.';
  alunos: Aluno[] = [];
  dataSource: MatTableDataSource<Aluno>;
  selection = new SelectionModel<Aluno>(true, []);
  displayedColumns: string[] = ['select', 'name', 'studentCode'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    public dialogRef: MatDialogRef<MatricularAlunoAulaComponent>,
    private formBuilder: FormBuilder,
    private service: AulaService,
    private alunoService: AlunoService,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.form = this.formBuilder.group({
      _id: [0],
      discipline: null,
      teacher: null,
      semester: null,
      weeklyQuantity: 0,
      students: [],
      allocated: null
    });
    this.dataSource = new MatTableDataSource<Aluno>([]);
  }

  ngOnInit(): void {
    this.alunoService.listar().subscribe((alunos: Aluno[]) => {
      if (this.data && this.data.aula && this.data.aula.students) {
        const alunoIdsMatriculados = this.data.aula.students.map((aluno: Aluno) => aluno._id);
        this.alunos = alunos.filter((aluno: Aluno) => !alunoIdsMatriculados.includes(aluno._id));
      } else {
        this.alunos = alunos;
      }
      this.dataSource.data = this.alunos;
      this.dataSource.paginator = this.paginator;
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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onSubmit() {
    const selectedAlunos = this.selection.selected;
    const mergedStudents = [...selectedAlunos, ...this.data.aula.students];

    this.form.patchValue({ students: mergedStudents });

    delete this.form.value.teacher.authorities;

    this.service.save(this.form.value).subscribe(
      result => this.onSucess(),
      error => this.onFailed()
    );
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

  toggleSelection(aluno: Aluno) {
    this.selection.toggle(aluno);
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ? this.selection.clear() : this.dataSource.data.forEach((row: Aluno) => this.selection.select(row));
  }
}
