import { Holiday } from './../../models/Holiday';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CalendarService } from '../../shared-services/calendar.service';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [
    NgClass,
    NgForOf,
    NgIf,
    HttpClientModule
  ],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})

export class CalendarComponent implements OnInit {
  currentDate: Date = new Date();
  today: Date = new Date();
  monthYear: string = '';
  days: number[] = [];
  holidays: Holiday[] = [];
  startYear: number = 2012;
  endYear: number = 2025;

  constructor(private calendarService: CalendarService) {
    this.updateCalendar();
  }

  ngOnInit() {
    this.loadHolidays();
  }

  loadHolidays() {
    const year = this.currentDate.getFullYear();
    const state = 'ES'; // Sigla do estado
    const city = 'Colatina'; // Nome da cidade

    if (year < this.startYear || year > this.endYear) {
      console.error('Ano fora do limite permitido');
      return;
    }

    this.holidays = []; // Reset holidays

    this.calendarService.getMunicipalHolidays(year).subscribe(
      (data: Holiday[]) => {
        this.holidays.push(...data.filter(holiday => holiday.municipio === city && holiday.uf === state));
        this.updateCalendar();
      },
      (error) => console.error('Erro ao carregar feriados municipais:', error)
    );

    this.calendarService.getStateHolidays(year).subscribe(
      (data: Holiday[]) => {
        this.holidays.push(...data.filter(holiday => holiday.uf === state));
        this.updateCalendar();
      },
      (error) => console.error('Erro ao carregar feriados estaduais:', error)
    );

    this.calendarService.getNationalHolidays(year).subscribe(
      (data: Holiday[]) => {
        this.holidays.push(...data);
        this.updateCalendar();
      },
      (error) => console.error('Erro ao carregar feriados nacionais:', error)
    );
  }

  updateCalendar() {
    this.days = [];
    const month = this.currentDate.getMonth();
    const year = this.currentDate.getFullYear();
    this.monthYear = `${this.currentDate.toLocaleString('default', { month: 'long' }).toUpperCase()} ${year}`;

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) {
      this.days.push(0);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      this.days.push(day);
    }
  }

  prevMonth() {
    if (this.currentDate.getMonth() === 0 && this.currentDate.getFullYear() === this.startYear) {
      return;
    }
    this.currentDate.setMonth(this.currentDate.getMonth() - 1);
    this.loadHolidays();
  }

  nextMonth() {
    if (this.currentDate.getMonth() === 11 && this.currentDate.getFullYear() === this.endYear) {
      return;
    }
    this.currentDate.setMonth(this.currentDate.getMonth() + 1);
    this.loadHolidays();
  }

  getDayClass(day: number): string {
    if (day === 0) return '';
    const dayOfWeek = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), day).getDay();
    let classes = 'day';

    if (dayOfWeek === 0 || dayOfWeek === 6) {
      classes += ' weekend';
    }
    if (day === this.today.getDate() && this.currentDate.getMonth() === this.today.getMonth() && this.currentDate.getFullYear() === this.today.getFullYear()) {
      classes += ' current-day';
    }
    const holiday = this.isHoliday(day);
    if (holiday) {
      classes += ` holiday ${this.getHolidayClass(holiday.tipo)}`;
    }
    return classes;
  }

  isHoliday(day: number): Holiday | null {
    const date = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), day).toLocaleDateString('pt-BR');
    return this.holidays.find(holiday => holiday.data === date) || null;
  }

  getMonthlyHolidays(): Holiday[] {
    const month = this.currentDate.getMonth();
    return this.holidays.filter(holiday => {
      const holidayDate = new Date(holiday.data.split('/').reverse().join('-'));
      return holidayDate.getMonth() === month;
    });
  }

  getHolidayClass(type: string): string {
    switch (type) {
      case 'NACIONAL':
        return 'national';
      case 'ESTADUAL':
        return 'state';
      case 'MUNICIPAL':
        return 'municipal';
      case 'FACULTATIVO':
        return 'optional';
      default:
        return '';
    }
  }

  hasHolidaysThisMonth(): boolean {
    return this.getMonthlyHolidays().length > 0;
  }
}
