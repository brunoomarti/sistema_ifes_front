import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-tela-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './tela-login.component.html',
  styleUrl: './tela-login.component.css'
})
export class TelaLoginComponent {

  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder
  )

  {
    this.form = this.formBuilder.group({
      _id: [0],
      login: '',
      password: ''
    });
  }

  login() {

  }

}
