import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AllocateService } from './service/allocate.service';
import { Alocar } from '../../../models/Alocar';
import { EventoService } from '../evento/service/evento.service';
import { EdicaoAlocacaoAulaComponent } from './edicao-alocacao-aula/edicao-alocacao-aula.component';
import { EdicaoAlocacaoEventoComponent } from './edicao-alocacao-evento/edicao-alocacao-evento.component';
import { VerHistoricoAulaComponent } from './ver-historico-aula/ver-historico-aula.component';
import { VerHistoricoEventoComponent } from './ver-historico-evento/ver-historico-evento.component';
import { HistoryService } from './historyService/history.service';

@Component({
  selector: 'app-allocate-location',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatTableModule,
    RouterLink,
    RouterLinkActive,
    FormsModule
  ],
  templateUrl: './allocate-location.component.html',
  styleUrl: './allocate-location.component.css'
})
export class AllocateLocationComponent implements OnInit {

  formHistory: FormGroup;
  alocacoesAula: any[] = [];
  alocacoesEvento: any[] = [];
  dataSource: any;
  mensagemSnackbarAcerto: string = 'Alocação excluída com sucesso.';
  mensagemSnackbarErro: string = 'Erro ao excluir alocação.';
  selectedFilter: string = 'Ambos';

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private service: AllocateService,
    private historyService: HistoryService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    private eventoService: EventoService,
  ) {
    this.formHistory = this.formBuilder.group({
      _id: 0,
      lesson: null,
      classe: null,
      startDate: null,
      endDate: null,
      selectedTimes:[],
      location: null,
      semester: null,
      type: null,
      weekDay: null,
      alocacao: null,
      date: null,
      authorName: null,
      changeType: null,
    });
   }

  ngOnInit(): void {
    this.atualizaTabelaAula();
    this.atualizaTabelaEvento();
  }

  atualizaTabelaAula() {
    this.service.listar().subscribe(alocacoes => {
      this.alocacoesAula = alocacoes.filter(alocacao => alocacao.type === 'Aula');
      this.dataSource = new MatTableDataSource<Alocar>(this.alocacoesAula);
      this.dataSource.paginator = this.paginator;
    });
  }

  atualizaTabelaEvento() {
    this.service.listar().subscribe(alocacoes => {
      this.alocacoesEvento = alocacoes.filter(alocacao => alocacao.type === 'Evento');
      this.dataSource = new MatTableDataSource<Alocar>(this.alocacoesEvento);
      this.dataSource.paginator = this.paginator;
    });
  }

  editarAlocacaoAula(alocacao: Alocar): void {
    const dialogRef = this.dialog.open(EdicaoAlocacaoAulaComponent, {
      disableClose: false,
      backdropClass: 'backdrop',
      data: { alocacao }
    });

    dialogRef.afterClosed().subscribe(() => {
      this.atualizaTabelaAula();
    });
  }

  editarAlocacaoEvento(alocacao: Alocar): void {
    const dialogRef = this.dialog.open(EdicaoAlocacaoEventoComponent, {
      disableClose: false,
      backdropClass: 'backdrop',
      data: { alocacao }
    });

    dialogRef.afterClosed().subscribe(() => {
      this.atualizaTabelaAula();
    });
  }

  excluir(alocacao: Alocar): void {
    const confirmacao = confirm('Tem certeza que deseja desativar esta alocação?');
    if (confirmacao) {

      const selectedTimesAsString = alocacao.selectedTimes.map(time => ({
        _id: time._id,
        startTime: time.startTime.toString(),
        endTime: time.endTime.toString()
      }));

      this.formHistory.setValue({
        _id: 0,
        lesson: alocacao.lesson,
        classe: alocacao.classe,
        startDate: alocacao.startDate,
        endDate: alocacao.endDate,
        selectedTimes: JSON.stringify(selectedTimesAsString),
        semester: alocacao.lesson.semester,
        location: alocacao.location,
        type: 'Aula',
        weekDay: alocacao.weekDay,
        alocacao: alocacao,
        date: new Date(),
        authorName: 'Igor',
        changeType: 'Desativação',
      });

      alocacao.active = false;
      this.service.save(alocacao).subscribe(result => this.deleteSuccess(), error => this.deleteFailed());
      this.historyService.save(this.formHistory.value).subscribe(result => console.log('salvou historico'), error => console.log('não salvou historico'));
    }
  }

  onFailed() {
    this.snackBar.open(this.mensagemSnackbarErro, '', { duration: 5000, panelClass: ['errorSnackbar'] });
  }

  deleteFailed() {
    this.snackBar.open('Falha ao desativar alocação.', '', { duration: 5000, panelClass: ['errorSnackbar'] });
  }

  deleteSuccess() {
    this.snackBar.open('Alocação desativada com sucesso.', '', { duration: 5000, panelClass: ['errorSnackbar'] });
  }

  onSucess(excluir: boolean = false, evento: boolean) {
    if (excluir) {
      this.snackBar.open('Alocação excluída com sucesso', '', { duration: 5000, panelClass: ['successSnackbar'] });
      if (evento) {
        this.atualizaTabelaEvento();
      } else {
        this.atualizaTabelaAula();
      }
    } else {
      this.snackBar.open(this.mensagemSnackbarAcerto, '', { duration: 5000, panelClass: ['successSnackbar'] });
    }
  }

  onSucessEvent() {
    this.snackBar.open('Evento desalocado com sucesso', '', { duration: 5000, panelClass: ['successSnackbar'] });
  }

  onFailedEvent() {
    this.snackBar.open('Erro ao desalocar evento', '', { duration: 5000, panelClass: ['errorSnackbar'] });
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

  toggleTableVisibility(filter: string) {
    this.selectedFilter = filter;
  }

  verHistoricoAula(alocacao: Alocar): void {
    const dialogRef = this.dialog.open(VerHistoricoAulaComponent, {
      disableClose: false,
      backdropClass: 'backdrop',
      data: { alocacao }
    });
  }

  verHistoricoEvento(alocacao: Alocar): void {
    const dialogRef = this.dialog.open(VerHistoricoEventoComponent, {
      disableClose: false,
      backdropClass: 'backdrop',
      data: { alocacao }
    });
  }
}
