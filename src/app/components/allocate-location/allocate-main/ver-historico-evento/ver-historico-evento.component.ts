import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { HistoryService } from '../historyService/history.service';
import { Alocar } from '../../../../models/Alocar';

@Component({
  selector: 'app-ver-historico-evento',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatTableModule,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './ver-historico-evento.component.html',
  styleUrl: './ver-historico-evento.component.css'
})
export class VerHistoricoEventoComponent implements OnInit {

  historicoEvento: any[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    public dialogRef: MatDialogRef<VerHistoricoEventoComponent>,
    private service: HistoryService,
    @Inject(MAT_DIALOG_DATA) public data: Alocar,
  ) { }

  ngOnInit(): void {
    this.atualizaTabelaHistoricoAula();
  }

  atualizaTabelaHistoricoAula() {
    this.service.listar().subscribe(alocacoes => {
      this.historicoEvento = alocacoes;
    });
    console.log(this.historicoEvento);
  }

}
