import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { Alocar } from '../../../../models/Alocar';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { HistoryService } from '../historyService/history.service';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-ver-historico-aula',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatTableModule,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './ver-historico-aula.component.html',
  styleUrl: './ver-historico-aula.component.css'
})
export class VerHistoricoAulaComponent implements OnInit {

  historicoAula: any[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    public dialogRef: MatDialogRef<VerHistoricoAulaComponent>,
    private service: HistoryService,
    @Inject(MAT_DIALOG_DATA) public data: Alocar,
  ) { }

  ngOnInit(): void {
    this.atualizaTabelaHistoricoAula();
  }

  atualizaTabelaHistoricoAula() {
    this.service.listar().subscribe(historico => {
      this.historicoAula = historico.filter(item => item.allocation._id === this.data.alocacao._id);
    });
  }

  formatSchedule(alocacao: any): string { 
    const strinToJson = JSON.stringify(alocacao.selectedTimes);
    const selectedTimes = JSON.parse(strinToJson);
    if (selectedTimes.length === 0) {
      return '';
    }
    
    const firstTime = selectedTimes[0];
    return `${firstTime.startTime} ~ ${firstTime.endTime}`;
  }

  getFormattedSchedule(alocacao: Alocar): string {
    const selectedTimes = alocacao.selectedTimes;
    if (selectedTimes.length === 0) {
      return '';
    }
    const firstStartTime = selectedTimes[0].startTime;
    const lastEndTime = selectedTimes[selectedTimes.length - 1].endTime;
    return `${firstStartTime} ~ ${lastEndTime}`;
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
