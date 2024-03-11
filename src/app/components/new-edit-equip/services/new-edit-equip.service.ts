import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Equipamento } from '../../../models/Equipamento';
import { first, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EquipmentService {

  private readonly API = 'api/equipment';

  constructor(private httpClient: HttpClient) { }

  save(record: Partial<Equipamento>) {
    if (record._id) {
      return this.update(record);
    }
    return this.create(record);
  }

  listar() {
    return this.httpClient.get<Equipamento[]>(this.API)
      .pipe(
        first(),
        tap(equipamentos => console.log()))
  }

  loadById(id: string) {
    return this.httpClient.get<Equipamento>(`${this.API}/${id}`);
  }

  private create(record: Partial<Equipamento>) {
    return this.httpClient.post<Equipamento>(`${this.API}/new`, record).pipe(first());
  }

  private update(record: Partial<Equipamento>) {
    return this.httpClient.put<Equipamento>(`${this.API}/edit/${record._id}`, record).pipe(first());
  }

  remove(_id: number) {
    return this.httpClient.delete(`${this.API}/${_id}`);
  }

}
