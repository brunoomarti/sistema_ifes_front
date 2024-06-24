import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AllocateService } from './service/allocate.service';
import { Alocar } from '../../../models/Alocar';
import { EventoService } from '../evento/service/evento.service';
import { EdicaoAlocacaoAulaComponent } from './edicao-alocacao-aula/edicao-alocacao-aula.component';
import { EdicaoAlocacaoEventoComponent } from './edicao-alocacao-evento/edicao-alocacao-evento.component';
import { VerHistoricoAulaComponent } from './ver-historico-aula/ver-historico-aula.component';
import { VerHistoricoEventoComponent } from './ver-historico-evento/ver-historico-evento.component';
import { HistoryService } from './historyService/history.service';
import { MatSort, MatSortModule } from '@angular/material/sort';

@Component({
  selector: 'app-allocate-location',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatTableModule,
    RouterLink,
    RouterLinkActive,
    FormsModule,
    MatSortModule
  ],
  templateUrl: './allocate-location.component.html',
  styleUrls: ['./allocate-location.component.css']
})
export class AllocateLocationComponent implements OnInit {

  formHistoryAula: FormGroup;
  formHistoryEvento: FormGroup;
  alocacoesAula: Alocar[] = [];
  alocacoesEvento: Alocar[] = [];
  dataSourceAula = new MatTableDataSource<Alocar>(this.alocacoesAula);
  dataSourceEvento = new MatTableDataSource<Alocar>(this.alocacoesEvento);
  mensagemSnackbarAcerto: string = 'Alocação excluída com sucesso.';
  mensagemSnackbarErro: string = 'Erro ao excluir alocação.';
  selectedFilter: string = 'Ambos';
  userRole: string | null = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private service: AllocateService,
    private historyService: HistoryService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    private eventoService: EventoService,
  ) {
    this.formHistoryAula = this.formBuilder.group({
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
      allocation: null,
      date: null,
      authorName: null,
      changeType: null,
    });

    this.formHistoryEvento = this.formBuilder.group({
      _id: 0,
      event: null,
      startDate: null,
      endDate: null,
      startTime: null,
      endTime: null,
      applicant: null,
      location: null,
      type: null,
      allocation: null,
      date: null,
      authorName: null,
      changeType: null,
    });
  }

  ngOnInit(): void {
    this.atualizaTabelaAula();
    this.atualizaTabelaEvento();

    if (typeof localStorage !== 'undefined') {
      this.userRole = localStorage.getItem('role');
    }
  }

  applyFilterAula(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSourceAula.filterPredicate = (data: Alocar, filter: string) => {
      return data.lesson.discipline.name.toLowerCase().includes(filter) ||
             data.lesson.teacher.name.toLowerCase().includes(filter) ||
             data.classe.name.toLowerCase().includes(filter) ||
             data.location.name.toLowerCase().includes(filter) ||
             data.weekDay.toLowerCase().includes(filter);
    };
    this.dataSourceAula.filter = filterValue;
  }

  applyFilterEvento(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSourceEvento.filterPredicate = (data: Alocar, filter: string) => {
      return data.event.name.toLowerCase().includes(filter) ||
             data.applicant.toLowerCase().includes(filter) ||
             data.location.name.toLowerCase().includes(filter);
    };
    this.dataSourceEvento.filter = filterValue;
  }

  atualizaTabelaAula() {
    this.service.listar().subscribe(alocacoes => {
      this.alocacoesAula = alocacoes.filter(alocacao => alocacao.type === 'Aula');
      this.dataSourceAula = new MatTableDataSource<Alocar>(this.alocacoesAula);
      this.dataSourceAula.paginator = this.paginator;
      this.dataSourceAula.sort = this.sort;
      this.dataSourceAula.sortingDataAccessor = (item: Alocar, property: string) => {
        console.log('Sorting', property, item);
        switch (property) {
          case 'discipline': return item.lesson.discipline.name.toLowerCase();
          case 'teacher': return item.lesson.teacher.name.toLowerCase();
          case 'class': return item.classe.name.toLowerCase();
          case 'location': return item.location.name.toLowerCase();
          case 'weekDay': return item.weekDay.toLowerCase();
          default: return (item as any)[property];
        }
      };
    });
  }

  atualizaTabelaEvento() {
    this.service.listar().subscribe(alocacoes => {
      this.alocacoesEvento = alocacoes.filter(alocacao => alocacao.type === 'Evento');
      this.dataSourceEvento = new MatTableDataSource<Alocar>(this.alocacoesEvento);
      this.dataSourceEvento.paginator = this.paginator;
      this.dataSourceEvento.sort = this.sort;
      this.dataSourceEvento.sortingDataAccessor = (item: Alocar, property: string) => {
        switch (property) {
          case 'event': return item.event.name.toLowerCase();
          case 'applicant': return item.applicant.toLowerCase();
          case 'location': return item.location.name.toLowerCase();
          default: return (item as any)[property];
        }
      };
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
      this.atualizaTabelaEvento();
    });
  }

  excluirAlocacaoAula(alocacao: Alocar): void {
    const confirmacao = confirm('Tem certeza que deseja desativar esta alocação?');
    if (confirmacao) {

      const selectedTimesAsString = alocacao.selectedTimes.map(time => ({
        _id: time._id,
        startTime: time.startTime.toString(),
        endTime: time.endTime.toString()
      }));

      this.formHistoryAula.setValue({
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
        allocation: alocacao,
        date: new Date(),
        authorName: 'Igor',
        changeType: 'Desativação',
      });

      alocacao.active = false;
      this.historyService.save(this.formHistoryAula.value).subscribe(result => console.log('salvou historico'), error => console.log('não salvou historico'));
      this.service.save(alocacao).subscribe(result => this.deleteSuccess(), error => this.deleteFailed());
    }
  }

  excluirAlocacaoEvento(alocacao: Alocar): void {
    const confirmacao = confirm('Tem certeza que deseja desativar esta alocação?');
    if (confirmacao) {

      this.formHistoryEvento.setValue({
        _id: 0,
        event: alocacao.event,
        startDate: alocacao.startDate,
        endDate: alocacao.endDate,
        startTime: alocacao.startTime,
        endTime: alocacao.endTime,
        applicant: alocacao.applicant,
        location: alocacao.location,
        type: 'Evento',
        allocation: alocacao,
        date: new Date(),
        authorName: 'Igor',
        changeType: 'Desativação',
      });

      alocacao.event.allocated = false;
      alocacao.active = false;
      this.historyService.save(this.formHistoryEvento.value).subscribe(result => console.log('salvou historico'), error => console.log('não salvou historico'));
      this.service.save(alocacao).subscribe(result => this.deleteSuccess(), error => this.deleteFailed());
      this.eventoService.save(alocacao.event).subscribe(result => this.deleteSuccess(), error => this.deleteFailed());
    }
  }

  onFailed() {
    this.snackBar.open(this.mensagemSnackbarErro, '', { duration: 5000, panelClass: ['errorSnackbar'] });
  }

  deleteFailed() {
    this.snackBar.open('Falha ao desativar alocação.', '', { duration: 5000, panelClass: ['errorSnackbar'] });
  }

  deleteSuccess() {
    this.snackBar.open('Alocação desativada com sucesso.', '', { duration: 5000, panelClass: ['successSnackbar'] });
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
