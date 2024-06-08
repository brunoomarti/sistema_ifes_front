import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Aluno } from '../../../../models/Aluno';
import { Observable, first, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlunoService {

  private readonly API = 'api/student';

  constructor(private httpClient: HttpClient) { }

  save(record: Partial<Aluno>) {
    if (record._id) {
      return this.update(record);
    }
    return this.create(record);
  }

  private create(record: Partial<Aluno>) {
    return this.httpClient.post<Aluno>(`${this.API}/new`, record).pipe(first());
  }

  private update(record: Partial<Aluno>) {
    return this.httpClient.put<Aluno>(`${this.API}/edit/${record._id}`, record).pipe(first());
  }

  listar() {
    return this.httpClient.get<Aluno[]>(this.API)
      .pipe(
        first(),
        tap(alunos => console.log()))
  }

  loadById(id: string) {
    return this.httpClient.get<Aluno>(`${this.API}/${id}`);
  }

  idByCode(studentCode: string) {
    return this.httpClient.get<Aluno>(`${this.API}/idByCode/${studentCode}`);
  }

  remove(_id: number) {
    return this.httpClient.delete(`${this.API}/${_id}`);
  }

  getStudentSchedule(studentCode: number) {
    return this.httpClient.get<any>(`${this.API}/schedule/${studentCode}`);
  }

  getRegistrosUsandoAluno(turmaId: number): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.API}/${turmaId}/records`);
  }
}
