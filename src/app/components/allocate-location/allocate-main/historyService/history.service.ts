import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Historico } from '../../../../models/Historico';
import { first, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HistoryService {

  private readonly API = 'api/history';

  constructor(private httpClient: HttpClient) { }

  save(record: Partial<Historico>) {
    if (record._id) {
      return this.update(record);
    }
    return this.create(record);
  }

  private create(record: Partial<Historico>) {
    return this.httpClient.post<Historico>(`${this.API}`, record).pipe(first());
  }

  private update(record: Partial<Historico>) {
    return this.httpClient.put<Historico>(`${this.API}/${record._id}`, record).pipe(first());
  }

  listar() {
    return this.httpClient.get<Historico[]>(this.API)
      .pipe(
        first(),
        tap(alocacoes => console.log()))
  }

  loadById(id: string) {
    return this.httpClient.get<Historico>(`${this.API}/${id}`);
  }

  remove(_id: number) {
    return this.httpClient.delete(`${this.API}/${_id}`);
  }
}
