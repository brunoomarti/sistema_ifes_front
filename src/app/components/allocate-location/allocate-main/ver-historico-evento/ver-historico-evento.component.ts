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
    this.atualizaTabelaHistoricoEvento();
  }

  atualizaTabelaHistoricoEvento() {
    this.service.listar().subscribe(historico => {
      console.log(historico);
      console.log(this.data.alocacao._id);
      this.historicoEvento = historico.filter(item => item.allocation._id === this.data.alocacao._id);
    });
  }

  formatDateAndTime(date: string): string {
    const parsedDate = new Date(date);
    parsedDate.setHours(parsedDate.getHours());

    const formattedDate = `${parsedDate.getDate().toString().padStart(2, '0')}-` +
                          `${(parsedDate.getMonth() + 1).toString().padStart(2, '0')}-` +
                          `${parsedDate.getFullYear()}`;

    const formattedTime = `${parsedDate.getHours().toString().padStart(2, '0')}:` +
                          `${parsedDate.getMinutes().toString().padStart(2, '0')}`;

    return `${formattedDate} ${formattedTime}`;
  }

}
