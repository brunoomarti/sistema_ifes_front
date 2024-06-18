import { Injectable } from '@angular/core';
import { Turma } from '../../../../models/Turma';
import { HttpClient } from '@angular/common/http';
import { Observable, first, tap } from 'rxjs';

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
    return this.httpClient.post<Turma>(`${this.API}`, record).pipe(first());
  }

  private update(record: Partial<Turma>) {
    return this.httpClient.put<Turma>(`${this.API}/${record._id}`, record).pipe(first());
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

  getRegistrosUsandoTurma(turmaId: number): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.API}/${turmaId}/records`);
  }
}
