import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AllocateService } from './service/allocate.service';
import { Alocar } from '../../../models/Alocar';
import { EdicaoAlocacaoComponent } from './edicao-alocacao/edicao-alocacao.component';

@Component({
  selector: 'app-allocate-location',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatTableModule,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './allocate-location.component.html',
  styleUrl: './allocate-location.component.css'
})
export class AllocateLocationComponent implements OnInit {

  alocacoesAula: any[] = [];
  alocacoesEvento: any[] = [];
  dataSource: any;
  mensagemSnackbarAcerto: string = 'Alocação excluída com sucesso.';
  mensagemSnackbarErro: string = 'Erro ao excluir alocação.';

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private service: AllocateService,
    private router: Router,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
  ) { }

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

  editar(alocacao: { name: string }): void {
    const dialogRef = this.dialog.open(EdicaoAlocacaoComponent, {
      disableClose: true,
      backdropClass: 'backdrop',
      data: { alocacao }
    });

    dialogRef.afterClosed().subscribe(() => {
      this.atualizaTabelaAula();
    });
  }

  excluir(alocacao: Alocar): void {
    const confirmacao = confirm('Tem certeza que deseja excluir esta alocação?');
    if (confirmacao) {
      this.service.remove(alocacao._id).subscribe(() => {
        this.alocacoesAula = this.alocacoesAula.filter(e => e._id !== alocacao._id);
        if (alocacao.type === 'Evento'){
          this.onSucess(true, true);
        } else {
          this.onSucess(true, false);
        }

      }, error => {
        this.onFailed();
      });
    }
  }

  onFailed() {
    this.snackBar.open(this.mensagemSnackbarErro, '', { duration: 5000, panelClass: ['errorSnackbar'] });
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

  getFormattedSchedule(alocacao: Alocar): string {
    const selectedTimes = alocacao.selectedTimes;
    if (selectedTimes.length === 0) {
      return '';
    }
    const firstStartTime = selectedTimes[0].startTime;
    const lastEndTime = selectedTimes[selectedTimes.length - 1].endTime;
    return `${firstStartTime} ~ ${lastEndTime}`;
  }

}
