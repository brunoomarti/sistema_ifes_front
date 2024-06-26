import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Professor } from '../../../../models/Professor';
import { Observable, first, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfessorService {

  private readonly API = 'api/teacher';

  constructor(private httpClient: HttpClient) { }

  save(record: Partial<Professor>) {
    if (record._id) {
      return this.update(record);
    }
    return this.create(record);
  }

  private create(record: Partial<Professor>) {
    return this.httpClient.post<Professor>(`${this.API}`, record).pipe(first());
  }

  private update(record: Partial<Professor>) {
    return this.httpClient.put<Professor>(`${this.API}/${record._id}`, record).pipe(first());
  }

  listar() {
    return this.httpClient.get<Professor[]>(this.API)
      .pipe(
        first(),
        tap(professores => console.log()))
  }

  loadById(id: string) {
    return this.httpClient.get<Professor>(`${this.API}/${id}`);
  }

  idByCode(studentCode: string) {
    return this.httpClient.get<Professor>(`${this.API}/idByCode/${studentCode}`);
  }

  remove(_id: number) {
    return this.httpClient.delete(`${this.API}/${_id}`);
  }

  getRegistrosUsandoProfessor(localId: number): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.API}/${localId}/records`);
  }

  listarPaginado(page: number, size: number): Observable<Professor[]> {
    return this.httpClient.get<Professor[]>(`${this.API}?page=${page}&size=${size}`);
  }
}
