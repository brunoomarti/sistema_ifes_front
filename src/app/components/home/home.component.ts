import { Component, OnInit } from '@angular/core';
import { CalendarComponent } from '../calendar/calendar.component';
import { CommonModule } from '@angular/common';
import { HorarioIndividual } from '../../models/HorarioIndividual';
import { AulaService } from '../allocate-location/aula/service/aula.service';
import { Semestre } from '../../models/Semestre';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CalendarComponent, CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  role: string | null = '';
  userCode: string | null = '';
  horarioIndividual: HorarioIndividual[] = [];
  semestres: Semestre[] = [];
  currentSemester: Semestre | null = null;
  nextLesson: any = null;

  constructor(
    private aulaService: AulaService
  ) {}

  ngOnInit() {
    if (typeof localStorage !== 'undefined') {
      this.role = localStorage.getItem('role');
      this.userCode = localStorage.getItem('user_code');
    }
    this.findNextStudentLesson();
  }

  findNextStudentLesson() {
    if (this.userCode){
      this.aulaService.findNextLessonByStudentCode(this.userCode).subscribe(
        (result) => {
          this.nextLesson = result;
          this.formatLessonTime();
          console.log(this.nextLesson);
        },
        (error) => {
          console.log("deu erro")
        }
      );
    }
  }

  formatLessonTime() {
    const date = new Date(this.nextLesson.startTimeTs);
    const options: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'America/Sao_Paulo'
    };
    this.nextLesson.startTimeTs = date.toLocaleTimeString('pt-BR', options);
  }
}
