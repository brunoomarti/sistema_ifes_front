import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Disciplina } from '../../../../models/Disciplina';
import { first, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DisciplinaService {

  private readonly API = 'api/discipline';

  constructor(private httpClient: HttpClient) { }

  save(record: Partial<Disciplina>) {
    if (record._id) {
      return this.update(record);
    }
    return this.create(record);
  }

  private create(record: Partial<Disciplina>) {
    return this.httpClient.post<Disciplina>(`${this.API}/new`, record).pipe(first());
  }

  private update(record: Partial<Disciplina>) {
    return this.httpClient.put<Disciplina>(`${this.API}/edit/${record._id}`, record).pipe(first());
  }

  listar() {
    return this.httpClient.get<Disciplina[]>(this.API)
      .pipe(
        first(),
        tap(disciplinas => console.log()))
  }

  loadById(id: string) {
    return this.httpClient.get<Disciplina>(`${this.API}/${id}`);
  }

  remove(_id: number) {
    return this.httpClient.delete(`${this.API}/${_id}`);
  }

}
