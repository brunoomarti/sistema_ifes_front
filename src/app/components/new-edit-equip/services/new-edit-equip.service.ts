import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Equipamento } from '../../../models/Equipamento';
import { first } from 'rxjs/operators';

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

  loadById(id: string) {
    return this.httpClient.get<Equipamento>(`${this.API}/${id}`);
  }

  private create(record: Partial<Equipamento>) {
    return this.httpClient.post<Equipamento>(`${this.API}/new`, record).pipe(first());
  }

  private update(record: Partial<Equipamento>) {
    return this.httpClient.put<Equipamento>(`${this.API}/${record._id}`, record).pipe(first());
  }

}
