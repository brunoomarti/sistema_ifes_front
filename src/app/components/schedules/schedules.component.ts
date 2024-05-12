import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Semestre } from '../../models/Semestre';
import { SemestreService } from '../cadastro-gerencia/semestre/service/semestre.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AlunoService } from '../cadastro-gerencia/aluno/service/aluno.service';
import { AulaService } from '../allocate-location/aula/service/aula.service';

@Component({
  selector: 'app-schedules',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './schedules.component.html',
  styleUrl: './schedules.component.css'
})
export class SchedulesComponent implements OnInit {

  form: FormGroup;
  periodos: Semestre[] = [];
  horarioIndividual: any[] = [];
  semesterId: number = 0;
  tabela: any[][] = [];

  constructor(
    private formBuilder: FormBuilder,
    private semestreService: SemestreService,
    private service: AulaService,
    private snackBar: MatSnackBar
  )

  {
    this.form = this.formBuilder.group({
      _id: 0,
      scheduleType: null,
      scheduleStudent: null,
      scheduleTeacher: null,
      schedulePeriod: null
    });
  }

  ngOnInit(): void {
    this.semestreService.listar().subscribe(periodos => {
      this.periodos = periodos;
    });

    this.formInit();
    this.preencheVetor();
    this.preencheTabela();
  }

  formInit() {
    this.form.setValue({
      _id: 0,
      scheduleType: 'Aluno',
      scheduleStudent: null,
      scheduleTeacher: null,
      schedulePeriod: null
    });
  }

  onScheduleTypeChange(event: any) {
    const selectedType = event.target.value;
    if (selectedType === 'Aluno') {
      this.form.controls['scheduleProfessor'].reset();
    } else if (selectedType === 'Professor') {
      this.form.controls['scheduleStudent'].reset();
    }
  }

  onClean() {
    this.formInit();
  }

  onSubmit() {
    const scheduleType = this.form.get('scheduleType')?.value;
    const selectedSemester = this.periodos.find(obj => obj._id == this.form.value.schedulePeriod);

    if (selectedSemester) {
      this.semesterId = selectedSemester._id;
    }

    if (scheduleType === 'Aluno') {
      const studentCode = this.form.get('scheduleStudent')?.value;

      this.service.findLessonsByStudentCodeAndSemesterId(studentCode, this.semesterId).subscribe(
        result => {
          this.horarioIndividual = result;
          console.log(this.horarioIndividual);
          this.onSuccess();
        },
        error => {
          this.onFailed();
        }
      );
    } else if (scheduleType === 'Professor') {
      console.log("oi");
    }
  }


  onFailed() {
    console.log("puts")
  }

  onSuccess(excluir: boolean = false) {
    console.log("eba")
  }

  preencheVetor() {
    for (let i = 0; i < 7; i++) {
      this.tabela[i] = [];
      for (let j = 0; j < 17; j++) {
        if (i >= 2 && j >= 1 && j < 17) {

        } else {
          this.tabela[i][j] = '';
        }
      }
    }
    console.log(this.tabela);
  }

  preencheTabela() {
    const table = document.querySelector('.scheduleTable') as HTMLTableElement;

    for (let i = 2; i < 7; i++) {
      for (let j = 1; j < 17; j++) {
        const cell = table.rows[i].cells[j];
        cell.textContent = this.tabela[i][j];
      }
    }
  }

}
