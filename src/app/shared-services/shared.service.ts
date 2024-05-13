import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private selectedButtonSubject = new BehaviorSubject<number>(0);
  selectedButton$ = this.selectedButtonSubject.asObservable();

  constructor() { }

  updateSelectedButton(buttonNumber: number) {
    this.selectedButtonSubject.next(buttonNumber);
  }

  private dataSubject: BehaviorSubject<{ name: string, registration: string, type: string }> = new BehaviorSubject<{ name: string, registration: string, type: string }>({
    name: '',
    registration: '',
    type: ''
  });
  public readonly data$: Observable<{ name: string, registration: string, type: string }> = this.dataSubject.asObservable();

  setData(data: { name: string, registration: string, type: string }): void {
    this.dataSubject.next(data);
  }

  getData(): { name: string, registration: string, type: string } {
    return this.dataSubject.getValue();
  }
}
