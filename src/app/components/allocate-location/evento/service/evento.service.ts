import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Evento } from '../../../../models/Evento';
import { first, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventoService {

  private readonly API = 'api/event';

  constructor(private httpClient: HttpClient) { }

  save(record: Partial<Evento>) {
    if (record._id) {
      return this.update(record);
    }
    return this.create(record);
  }

  private create(record: Partial<Evento>) {
    return this.httpClient.post<Evento>(`${this.API}/new`, record).pipe(first());
  }

  private update(record: Partial<Evento>) {
    return this.httpClient.put<Evento>(`${this.API}/edit/${record._id}`, record).pipe(first());
  }

  listar() {
    return this.httpClient.get<Evento[]>(this.API)
      .pipe(
        first(),
        tap(eventos => console.log()))
  }

  loadById(id: string) {
    return this.httpClient.get<Evento>(`${this.API}/${id}`);
  }

  remove(_id: number) {
    return this.httpClient.delete(`${this.API}/${_id}`);
  }
}
