import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Curso } from '../../../../models/Curso';
import { Observable, first, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CursoService {

  private readonly API = 'api/course';

  constructor(private httpClient: HttpClient) { }

  save(record: Partial<Curso>) {
    if (record._id) {
      return this.update(record);
    }
    return this.create(record);
  }

  private create(record: Partial<Curso>) {
    return this.httpClient.post<Curso>(`${this.API}/new`, record).pipe(first());
  }

  private update(record: Partial<Curso>) {
    return this.httpClient.put<Curso>(`${this.API}/edit/${record._id}`, record).pipe(first());
  }

  listar() {
    return this.httpClient.get<Curso[]>(this.API)
      .pipe(
        first(),
        tap(alunos => console.log()))
  }

  loadById(id: string) {
    return this.httpClient.get<Curso>(`${this.API}/${id}`);
  }

  remove(_id: number) {
    return this.httpClient.delete(`${this.API}/${_id}`);
  }
  
  getRegistrosUsandoCurso(courseId: number): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.API}/${courseId}/records`);
  }
}
