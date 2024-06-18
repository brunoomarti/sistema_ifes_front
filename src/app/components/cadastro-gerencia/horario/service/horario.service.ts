import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Horario } from '../../../../models/Horario';
import { Observable, first, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HorarioService {

  private readonly API = 'api/schedule';

  constructor(private httpClient: HttpClient) { }

  save(record: Partial<Horario>) {
    if (record._id) {
      return this.update(record);
    }
    return this.create(record);
  }

  private create(record: Partial<Horario>) {
    return this.httpClient.post<Horario>(`${this.API}`, record).pipe(first());
  }

  private update(record: Partial<Horario>) {
    return this.httpClient.put<Horario>(`${this.API}/${record._id}`, record).pipe(first());
  }

  listar() {
    return this.httpClient.get<Horario[]>(this.API)
      .pipe(
        first(),
        tap(horarios => console.log()))
  }

  loadById(id: string) {
    return this.httpClient.get<Horario>(`${this.API}/${id}`);
  }

  remove(_id: number) {
    return this.httpClient.delete(`${this.API}/${_id}`);
  }

  getRegistrosUsandoHorario(horarioId: number): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.API}/${horarioId}/records`);
  }
}
