import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Horario } from '../../../../models/Horario';
import { first, tap } from 'rxjs';

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
    return this.httpClient.post<Horario>(`${this.API}/new`, record).pipe(first());
  }

  private update(record: Partial<Horario>) {
    return this.httpClient.put<Horario>(`${this.API}/edit/${record._id}`, record).pipe(first());
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
}
