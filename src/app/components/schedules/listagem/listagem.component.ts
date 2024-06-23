import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Aluno } from '../../../models/Aluno';
import { Professor } from '../../../models/Professor';
import { AlunoService } from '../../cadastro-gerencia/aluno/service/aluno.service';
import { ProfessorService } from '../../cadastro-gerencia/professor/service/professor.service';
import { SelectionModel } from '@angular/cdk/collections';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';

@Component({
  selector: 'app-listagem',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    MatPaginatorModule,
    MatSortModule,
  ],
  templateUrl: './listagem.component.html',
  styleUrls: ['./listagem.component.css'],
})
export class ListagemComponent implements OnInit, AfterViewInit {
  form: FormGroup;
  listagemAlunos: MatTableDataSource<Aluno> = new MatTableDataSource<Aluno>([]);
  listagemProfessores: MatTableDataSource<Professor> = new MatTableDataSource<Professor>([]);
  displayedColumnsAlunos: string[] = ['select', 'name', 'course', 'studentCode'];
  displayedColumnsProfessores: string[] = ['select', 'name', 'teacherCode'];
  selectionStudent = new SelectionModel<Aluno>(true, []);
  selectionTeacher = new SelectionModel<Professor>(true, []);
  userRole: string | null = '';
  userCode: string | null = '';
  userLogado: any;

  @ViewChild(MatPaginator) paginatorAlunos!: MatPaginator;
  @ViewChild(MatPaginator) paginatorProfessores!: MatPaginator;

  constructor(
    public dialogRef: MatDialogRef<ListagemComponent>,
    private formBuilder: FormBuilder,
    private alunoService: AlunoService,
    private profService: ProfessorService,
    private professorService: ProfessorService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = this.formBuilder.group({
      _id: [0],
      student: new FormControl(''),
      teacher: new FormControl(''),
    });
  }

  ngOnInit(): void {
    this.form.setValue({
      _id: 0,
      student: null,
      teacher: null,
    });

    if (typeof localStorage !== 'undefined') {
      this.userRole = localStorage.getItem('role');
      this.userCode = localStorage.getItem('user_code');
    }

    if (this.data.tipo === 'Aluno') {
      if (this.userRole === 'STUDENT') {
        if (this.userCode) {
          this.alunoService.idByCode(this.userCode).subscribe((result) => {
            this.userLogado = result;
            if (this.userLogado !== null) {
              this.listagemAlunos.data.push(this.userLogado);
              this.listagemAlunos._updateChangeSubscription();
            }
          });
        }
      }
      if (this.userRole === 'ADMIN' || this.userRole === 'COORDINATOR') {
        this.alunoService.listar().subscribe((alunos) => {
          this.listagemAlunos.data = alunos.sort((a, b) => a.name.localeCompare(b.name));
          if (this.listagemAlunos.data.length > 0) {
            this.form.get('student')?.setValue(this.listagemAlunos.data[0]._id);
          }
          this.listagemAlunos.paginator = this.paginatorAlunos;
        });
      }
    } else if (this.data.tipo === 'Professor') {
      if (this.userRole === 'TEACHER') {
        if (this.userCode) {
          this.profService.idByCode(this.userCode).subscribe((result) => {
            this.userLogado = result;
            if (this.userLogado !== null) {
              this.listagemProfessores.data.push(this.userLogado);
              this.listagemProfessores._updateChangeSubscription();
            }
          });
        }
      }
      if (this.userRole === 'ADMIN' || this.userRole === 'COORDINATOR') {
        this.professorService.listar().subscribe((professores) => {
          this.listagemProfessores.data = professores;
          if (this.listagemProfessores.data.length > 0) {
            this.form.get('teacher')?.setValue(this.listagemProfessores.data[0]._id);
          }
          this.listagemProfessores.paginator = this.paginatorProfessores;
        });
      }
    }
  }

  ngAfterViewInit(): void {
    this.listagemAlunos.paginator = this.paginatorAlunos;
    this.listagemProfessores.paginator = this.paginatorProfessores;
  }

  applyFilterStudent(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.listagemAlunos.filter = filterValue.trim().toLowerCase();
  }

  applyFilterTeacher(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.listagemProfessores.filter = filterValue.trim().toLowerCase();
  }

  toggleSelection(item: any, type: string) {
    if (type === 'student') {
      this.selectionStudent.clear();
      this.selectionStudent.select(item);
      this.form.get('student')?.setValue(item._id);
      this.form.get('teacher')?.disable();
    } else if (type === 'teacher') {
      this.selectionTeacher.clear();
      this.selectionTeacher.select(item);
      this.form.get('teacher')?.setValue(item._id);
      this.form.get('student')?.disable();
    }
  }

  isAllSelected(type: string) {
    if (type === 'student') {
      const numSelected = this.selectionStudent.selected.length;
      const numRows = this.listagemAlunos.data.length;
      return numSelected === numRows;
    } else if (type === 'teacher') {
      const numSelected = this.selectionTeacher.selected.length;
      const numRows = this.listagemProfessores.data.length;
      return numSelected === numRows;
    }
    return false;
  }

  masterToggle(type: string) {
    if (type === 'student') {
      this.isAllSelected('student') ? this.selectionStudent.clear() : this.listagemAlunos.data.forEach(row => this.selectionStudent.select(row));
    } else if (type === 'teacher') {
      this.isAllSelected('teacher') ? this.selectionTeacher.clear() : this.listagemProfessores.data.forEach(row => this.selectionTeacher.select(row));
    }
  }

  onCancel() {
    this.dialogRef.close();
  }

  onSubmit() {
    let resultado = {
      tipo: this.data.tipo,
      objetoSelecionado: null as unknown,
    };

    if (this.data.tipo === 'Aluno') {
      const selectedStudent = this.listagemAlunos.data.find((obj) => obj._id == this.form.value.student);
      if (selectedStudent) {
        resultado.objetoSelecionado = selectedStudent;
      }
    } else if (this.data.tipo === 'Professor') {
      const selectedTeacher = this.listagemProfessores.data.find((obj) => obj._id == this.form.value.teacher);
      if (selectedTeacher) {
        resultado.objetoSelecionado = selectedTeacher;
      }
    }

    this.dialogRef.close(resultado);
  }
}
