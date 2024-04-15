import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Aula } from '../../../../models/Aula';
import { first, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AulaService {

  private readonly API = 'api/lesson';

  constructor(private httpClient: HttpClient) { }

  save(record: Partial<Aula>) {
    if (record._id) {
      return this.update(record);
    }
    return this.create(record);
  }

  private create(record: Partial<Aula>) {
    return this.httpClient.post<Aula>(`${this.API}/new`, record).pipe(first());
  }

  private update(record: Partial<Aula>) {
    return this.httpClient.put<Aula>(`${this.API}/edit/${record._id}`, record).pipe(first());
  }

  listar() {
    return this.httpClient.get<Aula[]>(this.API)
      .pipe(
        first(),
        tap(aulas => console.log()))
  }

  loadById(id: string) {
    return this.httpClient.get<Aula>(`${this.API}/${id}`);
  }

  remove(_id: number) {
    return this.httpClient.delete(`${this.API}/${_id}`);
  }

}