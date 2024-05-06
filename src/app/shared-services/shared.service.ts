import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

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
}
