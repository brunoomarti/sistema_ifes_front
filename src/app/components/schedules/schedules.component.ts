import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Semestre } from '../../models/Semestre';
import { SemestreService } from '../cadastro-gerencia/semestre/service/semestre.service';
import { AulaService } from '../allocate-location/aula/service/aula.service';
import { HorarioIndividual } from '../../models/HorarioIndividual';
import { MatDialog } from '@angular/material/dialog';
import { ListagemComponent } from './listagem/listagem.component';
import { SharedService } from '../../shared-services/shared.service';
import { AlunoService } from '../cadastro-gerencia/aluno/service/aluno.service';
import { ProfessorService } from '../cadastro-gerencia/professor/service/professor.service';

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
  alunoSelecionado: any;
  professorSelecionado: any;
  userRole: string | null = '';

  constructor(
    private formBuilder: FormBuilder,
    private semestreService: SemestreService,
    private service: AulaService,
    private alunoService: AlunoService,
    private dialog: MatDialog,
    private sharedService: SharedService,
    private professorService: ProfessorService
  )

  {
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

    if (typeof localStorage !== 'undefined') {
      this.userRole = localStorage.getItem('role');
    }
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
        // this.alunoSelecionado = result;
        this.form.get('scheduleStudent')?.setValue(result.objetoSelecionado.studentCode);
      } else {
        this.professorSelecionado = result;
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

      this.alunoService
        .idByCode(code)
        .subscribe(
          (result) => {
            this.alunoSelecionado = result;
          },
          (error) => {
            console.log("não achou aluno")
          }
        );

      this.service
        .findLessonsByStudentCodeAndSemesterId(code, this.semesterId)
        .subscribe(
          (result) => {
            this.horarioIndividual = result;
            this.onSuccess(scheduleType);
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
            this.onSuccess(scheduleType);
          },
          (error) => {
            this.onFailed();
          }
        );
    }

  }

  onFailed() {
    console.log('err');
  }

  onSuccess(tipo: string) {
    if (tipo === 'Aluno') {
      const obj = { name: this.alunoSelecionado.name, registration: this.alunoSelecionado.studentCode, type: 'Aluno' };
      this.sharedService.setData(obj);
      this.form.get('scheduleStudent')?.setValue('');
    } else {
      const obj = { name: this.professorSelecionado.objetoSelecionado.name, registration: this.professorSelecionado.objetoSelecionado.teacherCode, type: 'Professor' };
      this.sharedService.setData(obj);
      this.form.get('scheduleTeacher')?.setValue('');
    }
    this.preencheVetor(tipo);
    this.preencheTabela();
  }

  preencheVetor(tipo: string) {
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
          this.preencheCelula(diaSemana, horario, i, j, tipo);
        } else {
          this.tabela[i][j] = '';
        }
      }
    }
  }

  preencheCelula(diaSemana: string, horario: string, i: number, j: number, tipo: string) {
    this.horarioIndividual.forEach((element) => {
      element.allocations.forEach((allocation) => {
        if (allocation.weekDay === diaSemana) {
          if (allocation.active) {
            allocation.selectedTimes.forEach((time) => {
              if (time.startTime === horario) {
                if (tipo === 'Aluno'){
                  const firstName = element.teacher.name.split(' ')[0];
                  this.tabela[i][j] =
                    firstName +
                    '\n' +
                    element.discipline.acronym +
                    '\n' +
                    allocation.location.name;
                } else {
                  this.tabela[i][j] =
                    allocation.classe.name +
                    '\n' +
                    element.discipline.acronym +
                    '\n' +
                    allocation.location.name;
                }
              }
            });
        }
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
