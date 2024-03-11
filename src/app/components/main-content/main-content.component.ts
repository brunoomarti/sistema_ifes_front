import { Component, OnInit } from '@angular/core';
import { NewEditEquipComponent } from '../new-edit-equip/component/new-edit-equip.component';
import { MatDialog } from '@angular/material/dialog';
import { EquipmentService } from '../new-edit-equip/services/new-edit-equip.service';
import { HttpClient } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-main-content',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgFor
  ],
  templateUrl: './main-content.component.html',
  styleUrl: './main-content.component.css'
})
export class MainContentComponent implements OnInit {

  equipamentos: any[] = [];

  constructor(public dialog: MatDialog,
              private service: EquipmentService,
              private http: HttpClient
              ) {}

  ngOnInit(): void {
    this.service.listar().subscribe(equipamentos => this.equipamentos = equipamentos);
  }

  novoEquipamento(): void {
    const dialogRef = this.dialog.open(NewEditEquipComponent, {
      disableClose: true,
      backdropClass: 'backdrop',
    });
  }

}
