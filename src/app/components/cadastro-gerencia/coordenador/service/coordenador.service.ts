import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Coordenador } from '../../../../models/Coordenador';
import { first, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CoordenadorService {

  private readonly API = 'api/coordinator';

  constructor(private httpClient: HttpClient) { }

  save(record: Partial<Coordenador>) {
    if (record._id) {
      return this.update(record);
    }
    return this.create(record);
  }

  private create(record: Partial<Coordenador>) {
    return this.httpClient.post<Coordenador>(`${this.API}/new`, record).pipe(first());
  }

  private update(record: Partial<Coordenador>) {
    return this.httpClient.put<Coordenador>(`${this.API}/edit/${record._id}`, record).pipe(first());
  }

  listar() {
    return this.httpClient.get<Coordenador[]>(this.API)
      .pipe(
        first(),
        tap(coordenadores => console.log()))
  }

  loadById(id: string) {
    return this.httpClient.get<Coordenador>(`${this.API}/${id}`);
  }

  remove(_id: number) {
    return this.httpClient.delete(`${this.API}/${_id}`);
  }

}
