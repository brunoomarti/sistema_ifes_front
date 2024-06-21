import { Holiday } from './../models/Holiday';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {
  private basePath = 'assets/feriados-brasil/dados/feriados';

  constructor(private http: HttpClient) { }

  getMunicipalHolidays(year: number): Observable<Holiday[]> {
    return this.http.get<Holiday[]>(`${this.basePath}/municipal/json/${year}.json`);
  }

  getStateHolidays(year: number): Observable<Holiday[]> {
    return this.http.get<Holiday[]>(`${this.basePath}/estadual/json/${year}.json`);
  }

  getNationalHolidays(year: number): Observable<Holiday[]> {
    return this.http.get<Holiday[]>(`${this.basePath}/nacional/json/${year}.json`);
  }

  getOptionalHolidays(year: number): Observable<Holiday[]> {
    return this.http.get<Holiday[]>(`${this.basePath}/facultativo/json/${year}.json`);
  }
}
