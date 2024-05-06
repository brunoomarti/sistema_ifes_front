import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { InfoPerson } from '../../../models/InfoPerson';

@Component({
  selector: 'app-person-info',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './person-info.component.html',
  styleUrl: './person-info.component.css'
})

export class PersonInfoComponent implements OnInit {

  data: InfoPerson = { person: '' };

  ngOnInit() {

  }

}
