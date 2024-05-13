import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { SharedService } from '../../../shared-services/shared.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-person-info',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './person-info.component.html',
  styleUrl: './person-info.component.css'
})

export class PersonInfoComponent implements OnInit, OnDestroy {

  data: { name: string, registration: string, type: string } = { name: '', registration: '', type: '' };
  private subscription: Subscription = new Subscription();

  constructor(private sharedService: SharedService) {}

  ngOnInit() {
    this.subscription = this.sharedService.data$.subscribe(data => {
      this.data = data || { name: '', registration: '', type: '' };
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
