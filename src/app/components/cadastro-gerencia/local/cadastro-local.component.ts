import { Component, OnInit } from '@angular/core';
import { NewEditEquipComponent } from '../../new-edit-equip/component/new-edit-equip.component';
import { MatDialog } from '@angular/material/dialog';
import { EquipmentService } from '../../new-edit-equip/services/new-edit-equip.service';
import { HttpClient } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { NgFor } from '@angular/common';
import { ReloadService } from '../../../shared-services/reload.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cadastro-local',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgFor
  ],
  templateUrl: './cadastro-local.component.html',
  styleUrl: './cadastro-local.component.css'
})
export class CadastroLocalComponent implements OnInit {

  equipamentos: any[] = [];

  constructor(public dialog: MatDialog,
              private service: EquipmentService,
              private http: HttpClient,
              private reloadService: ReloadService,
              private router: Router
              ) {}

  ngOnInit(): void {
    this.service.listar().subscribe(equipamentos => this.equipamentos = equipamentos);

    this.reloadService.reload$.subscribe(() => {
      this.service.listar().subscribe(equipamentos => this.equipamentos = equipamentos);
    });
  }

  novoEquipamento(): void {
    const dialogRef = this.dialog.open(NewEditEquipComponent, {
      disableClose: true,
      backdropClass: 'backdrop',
    });
  }

  cancelar() {
    if (confirm('Tem certeza que deseja cancelar?')) {
      this.router.navigate(['/cadastro-gerencia']);
    }
  }

}
