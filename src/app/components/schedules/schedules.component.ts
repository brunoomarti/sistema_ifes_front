import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Semestre } from '../../models/Semestre';
import { SemestreService } from '../cadastro-gerencia/semestre/service/semestre.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AlunoService } from '../cadastro-gerencia/aluno/service/aluno.service';
import { Aluno } from '../../models/Aluno';

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

  constructor(
    private formBuilder: FormBuilder,
    private semestreService: SemestreService,
    private studentService: AlunoService,
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

    if (scheduleType === 'Aluno') {
      this.studentService.getStudentSchedule(this.form.get('scheduleStudent')?.value).subscribe(
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

}
