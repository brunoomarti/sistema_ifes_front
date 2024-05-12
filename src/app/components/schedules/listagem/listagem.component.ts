import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Aluno } from '../../../models/Aluno';
import { Professor } from '../../../models/Professor';
import { AlunoService } from '../../cadastro-gerencia/aluno/service/aluno.service';
import { ProfessorService } from '../../cadastro-gerencia/professor/service/professor.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';

@Component({
  selector: 'app-listagem',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './listagem.component.html',
  styleUrl: './listagem.component.css',
})
export class ListagemComponent implements OnInit {
  form: FormGroup;
  listagemAlunos: Aluno[] = [];
  listagemProfessores: Professor[] = [];

  constructor(
    public dialogRef: MatDialogRef<ListagemComponent>,
    private formBuilder: FormBuilder,
    private alunoService: AlunoService,
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

    if (this.data.tipo === 'Aluno') {
      this.alunoService.listar().subscribe((alunos) => {
        this.listagemAlunos = alunos.sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        if (this.listagemAlunos.length > 0) {
          this.form.get('student')?.setValue(this.listagemAlunos[0]._id);
        }
      });
    } else if (this.data.tipo === 'Professor') {
      this.professorService.listar().subscribe((professores) => {
        this.listagemProfessores = professores;
        if (this.listagemProfessores.length > 0) {
          this.form.get('teacher')?.setValue(this.listagemProfessores[0]._id);
        }
      });
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
      const selectedStudent = this.listagemAlunos.find(
        (obj) => obj._id == this.form.value.student
      );
      if (selectedStudent) {
        resultado.objetoSelecionado = selectedStudent;
      }
    } else if (this.data.tipo === 'Professor') {
      const selectedTeacher = this.listagemProfessores.find(
        (obj) => obj._id == this.form.value.teacher
      );
      if (selectedTeacher) {
        resultado.objetoSelecionado = selectedTeacher;
      }
    }

    this.dialogRef.close(resultado);
  }
}
