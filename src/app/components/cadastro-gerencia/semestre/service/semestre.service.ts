import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Semestre } from '../../../../models/Semestre';
import { Observable, first, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SemestreService {

  private readonly API = 'api/semester';

  constructor(private httpClient: HttpClient) { }

  save(record: Partial<Semestre>) {
    if (record._id) {
      return this.update(record);
    }
    return this.create(record);
  }

  private create(record: Partial<Semestre>) {
    return this.httpClient.post<Semestre>(`${this.API}/new`, record).pipe(first());
  }

  private update(record: Partial<Semestre>) {
    return this.httpClient.put<Semestre>(`${this.API}/edit/${record._id}`, record).pipe(first());
  }

  listar() {
    return this.httpClient.get<Semestre[]>(this.API)
      .pipe(
        first(),
        tap(semestres => console.log()))
  }

  loadById(id: string) {
    return this.httpClient.get<Semestre>(`${this.API}/${id}`);
  }

  remove(_id: number) {
    return this.httpClient.delete(`${this.API}/${_id}`);
  }

  getRegistrosUsandoSemestre(semesterId: number): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.API}/${semesterId}/records`);
  }
}
