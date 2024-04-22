import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Local } from '../../../../models/Local';
import { Observable, catchError, first, of, tap } from 'rxjs';
import { EquipamentoLocal } from '../../../../models/EquipamentoLocal';

@Injectable({
  providedIn: 'root'
})
export class LocalService {

  private readonly API = 'api/local';

  constructor(private httpClient: HttpClient) { }

  save(record: Partial<Local>) {
    if (record._id) {
      return this.update(record);
    }
    return this.create(record);
  }

  private create(record: Partial<Local>) {
    return this.httpClient.post<Local>(`${this.API}/new`, record).pipe(first());
  }

  private update(record: Partial<Local>) {
    return this.httpClient.put<Local>(`${this.API}/edit/${record._id}`, record).pipe(first());
  }

  listar() {
    return this.httpClient.get<Local[]>(this.API)
      .pipe(
        first(),
        tap(locais => console.log()))
  }

  loadById(id: string) {
    return this.httpClient.get<Local>(`${this.API}/${id}`);
  }

  remove(_id: number) {
    return this.httpClient.delete(`${this.API}/${_id}`);
  }

  getEquipmentsByLocal(localId: number): Observable<EquipamentoLocal[]> {
    const url = `${this.API}/locais/${localId}/equipamentos`;

    return this.httpClient.get<EquipamentoLocal[]>(url).pipe(
      catchError(this.handleError<EquipamentoLocal[]>('getEquipmentsByLocal', []))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(`${operation} failed: ${error.message}`);

      return of(result as T);
    };
  }

  getLocaisAtivos(): Observable<Local[]> {
    return this.httpClient.get<Local[]>(`${this.API}/availableLocal`);
  }
}
