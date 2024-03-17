import { Injectable } from '@angular/core';
import { Turma } from '../../../../models/Turma';
import { HttpClient } from '@angular/common/http';
import { first, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TurmaService {

  private readonly API = 'api/classe';

  constructor(private httpClient: HttpClient) { }

  save(record: Partial<Turma>) {
    if (record._id) {
      return this.update(record);
    }
    return this.create(record);
  }

  private create(record: Partial<Turma>) {
    return this.httpClient.post<Turma>(`${this.API}/new`, record).pipe(first());
  }

  private update(record: Partial<Turma>) {
    return this.httpClient.put<Turma>(`${this.API}/edit/${record._id}`, record).pipe(first());
  }

  listar() {
    return this.httpClient.get<Turma[]>(this.API)
      .pipe(
        first(),
        tap(turmas => console.log()))
  }

  loadById(id: string) {
    return this.httpClient.get<Turma>(`${this.API}/${id}`);
  }

  remove(_id: number) {
    return this.httpClient.delete(`${this.API}/${_id}`);
  }
}
