import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Professor } from '../../../../models/Professor';
import { first, tap } from 'rxjs';

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
    return this.httpClient.post<Professor>(`${this.API}/new`, record).pipe(first());
  }

  private update(record: Partial<Professor>) {
    return this.httpClient.put<Professor>(`${this.API}/edit/${record._id}`, record).pipe(first());
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

  remove(_id: number) {
    return this.httpClient.delete(`${this.API}/${_id}`);
  }

}
