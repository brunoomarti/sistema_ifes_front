import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Equipamento } from '../app/models/Equipamento';

@Injectable({
  providedIn: 'root'
})
export class EquipamentoService {
  private readonly API = 'api/equipment';

  constructor(private httpClient: HttpClient) {}

  save(record: Partial<Equipamento>): Observable<Equipamento> {
    if (record._id) {
      return this.update(record);
    }
    return this.create(record);
  }

  private create(record: Partial<Equipamento>): Observable<Equipamento> {
    return this.httpClient.post<Equipamento>(this.API, record);
  }

  private update(record: Partial<Equipamento>): Observable<Equipamento> {
    return this.httpClient.put<Equipamento>(`${this.API}/${record._id}`, record);
  }
}
