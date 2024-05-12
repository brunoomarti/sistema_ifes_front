import { Aluno } from './../../models/Aluno';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Semestre } from '../../models/Semestre';
import { SemestreService } from '../cadastro-gerencia/semestre/service/semestre.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AlunoService } from '../cadastro-gerencia/aluno/service/aluno.service';
import { AulaService } from '../allocate-location/aula/service/aula.service';
import { Alocar } from '../../models/Alocar';
import { Horario } from '../../models/Horario';
import { HorarioIndividual } from '../../models/HorarioIndividual';
import { MatDialog } from '@angular/material/dialog';
import { ListagemComponent } from './listagem/listagem.component';

@Component({
  selector: 'app-schedules',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './schedules.component.html',
  styleUrl: './schedules.component.css',
})
export class SchedulesComponent implements OnInit {
  form: FormGroup;
  periodos: Semestre[] = [];
  horarioIndividual: HorarioIndividual[] = [];
  semesterId: number = 0;
  tabela: any[][] = [];

  constructor(
    private formBuilder: FormBuilder,
    private semestreService: SemestreService,
    private service: AulaService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.form = this.formBuilder.group({
      _id: 0,
      scheduleType: null,
      scheduleStudent: null,
      scheduleTeacher: null,
      schedulePeriod: null,
    });
  }

  ngOnInit(): void {
    this.semestreService.listar().subscribe((periodos) => {
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
      schedulePeriod: null,
    });
  }

  onScheduleTypeChange(event: any) {
    const selectedType = event.target.value;
    if (selectedType === 'Aluno') {
      this.form.controls['scheduleTeacher'].reset();
    } else if (selectedType === 'Professor') {
      this.form.controls['scheduleStudent'].reset();
    }
  }

  onList() {
    const scheduleType = this.form.get('scheduleType')?.value;
    if (scheduleType === 'Aluno') {
      const dialogData = {
        title: 'Listagem de alunos.',
        tipo: scheduleType
      };
      this.openDialog(dialogData);
    } else if (scheduleType === 'Professor') {
      const dialogData = {
        title: 'Listagem de professores.',
        tipo: scheduleType
      };
      this.openDialog(dialogData);
    }
  }

  openDialog(data: any): void {
    const dialogRef = this.dialog.open(ListagemComponent, {
      data: data,
      backdropClass: 'backdrop'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.tipo === 'Aluno') {
        this.form.get('scheduleStudent')?.setValue(result.objetoSelecionado.studentCode);
      } else {
        this.form.get('scheduleTeacher')?.setValue(result.objetoSelecionado.teacherCode);
      }
    });
  }

  onSubmit() {
    const scheduleType = this.form.get('scheduleType')?.value;
    const selectedSemester = this.periodos.find(
      (obj) => obj._id == this.form.value.schedulePeriod
    );

    if (selectedSemester) {
      this.semesterId = selectedSemester._id;
    }

    if (scheduleType === 'Aluno') {
      const code = this.form.get('scheduleStudent')?.value;

      this.service
        .findLessonsByStudentCodeAndSemesterId(code, this.semesterId)
        .subscribe(
          (result) => {
            this.horarioIndividual = result;
            this.onSuccess();
          },
          (error) => {
            this.onFailed();
          }
        );
    } else if (scheduleType === 'Professor') {
      const code = this.form.get('scheduleTeacher')?.value;

      this.service
        .findLessonsByTeacherCodeAndSemesterId(code, this.semesterId)
        .subscribe(
          (result) => {
            this.horarioIndividual = result;
            this.onSuccess();
          },
          (error) => {
            this.onFailed();
          }
        );
    }
  }

  onFailed() {
    console.log('puts');
  }

  onSuccess(excluir: boolean = false) {
    console.log(this.horarioIndividual);
    this.preencheVetor();
    this.preencheTabela();
  }

  preencheVetor() {
    const horarios = [
      '07:00',
      '07:50',
      '08:40',
      '09:50',
      '10:40',
      '11:30',
      '13:00',
      '13:50',
      '14:40',
      '15:50',
      '16:40',
      '17:30',
      '18:50',
      '19:35',
      '20:30',
      '21:15',
    ];

    const diasSemana = [
      'Domingo',
      'Segunda-feira',
      'Terça-feira',
      'Quarta-feira',
      'Quinta-feira',
      'Sexta-feira',
      'Sábado',
    ];

    for (let i = 0; i < 7; i++) {
      this.tabela[i] = [];
      const diaSemana = diasSemana[i-1];
      for (let j = 0; j < 17; j++) {
        const horario = horarios[j-1];
        if (i !== 0 && i !== 7) {
          this.preencheCelula(diaSemana, horario, i, j);
        } else {
          this.tabela[i][j] = '';
        }
      }
    }
  }

  preencheCelula(diaSemana: string, horario: string, i: number, j: number) {
    this.horarioIndividual.forEach((element) => {
      element.allocations.forEach((allocation) => {
        if (allocation.weekDay === diaSemana) {
          allocation.selectedTimes.forEach((time) => {
            if (time.startTime === horario) {
              const firstName = element.teacher.name.split(' ')[0];
              this.tabela[i][j] =
                firstName +
                '\n' +
                element.discipline.acronym +
                '\n' +
                allocation.location.name;
            }
          });
        }
      });
    });
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
