import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Alocar } from '../../../../models/Alocar';
import { first, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AllocateService {

  private readonly API = 'api/allocate';

  constructor(private httpClient: HttpClient) { }

  save(record: Partial<Alocar>) {
    if (record._id) {
      return this.update(record);
    }
    return this.create(record);
  }

  private create(record: Partial<Alocar>) {
    return this.httpClient.post<Alocar>(`${this.API}`, record).pipe(first());
  }

  private update(record: Partial<Alocar>) {
    return this.httpClient.put<Alocar>(`${this.API}/${record._id}`, record).pipe(first());
  }

  listar() {
    return this.httpClient.get<Alocar[]>(this.API)
      .pipe(
        first(),
        tap(alocacoes => console.log()))
  }

  loadById(id: string) {
    return this.httpClient.get<Alocar>(`${this.API}/${id}`);
  }

  remove(_id: number) {
    return this.httpClient.delete(`${this.API}/${_id}`);
  }
}
