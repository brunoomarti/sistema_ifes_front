import { NgModule } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NewEditEquipComponent } from './component/new-edit-equip.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    NewEditEquipComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgFor,
    NgModule,
    FormsModule,
    HttpClientModule
  ],
  exports: [
    NewEditEquipComponent,
    CommonModule,
    ReactiveFormsModule,
    NgFor,
    NgModule,
    FormsModule,
    HttpClientModule
  ]
})
export class NewEditEquipModule { }
