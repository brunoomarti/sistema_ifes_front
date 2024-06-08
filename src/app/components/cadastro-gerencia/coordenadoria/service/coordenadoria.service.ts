import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Coordenadoria } from '../../../../models/Coordenadoria';
import { Observable, first, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CoordenadoriaService {

  private readonly API = 'api/coordination';

  constructor(private httpClient: HttpClient) { }

  save(record: Partial<Coordenadoria>) {
    if (record._id) {
      return this.update(record);
    }
    return this.create(record);
  }

  private create(record: Partial<Coordenadoria>) {
    return this.httpClient.post<Coordenadoria>(`${this.API}/new`, record).pipe(first());
  }

  private update(record: Partial<Coordenadoria>) {
    return this.httpClient.put<Coordenadoria>(`${this.API}/edit/${record._id}`, record).pipe(first());
  }

  listar() {
    return this.httpClient.get<Coordenadoria[]>(this.API)
      .pipe(
        first(),
        tap(coordenadorias => console.log()))
  }

  loadById(id: string) {
    return this.httpClient.get<Coordenadoria>(`${this.API}/${id}`);
  }

  remove(_id: number) {
    return this.httpClient.delete(`${this.API}/${_id}`);
  }
 
  getRegistrosUsandoCoordenadoria(coordenadoriaId: number): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.API}/${coordenadoriaId}/records`);
  }

}
