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

  alocacoes: any[] = [];
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
    this.atualizaTabela();
  }

  atualizaTabela() {
    this.service.listar().subscribe(alocacoes => {
      this.alocacoes = alocacoes;
      this.dataSource = new MatTableDataSource<Alocar>(this.alocacoes);
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
      this.atualizaTabela();
    });
  }

  excluir(alocacao: Alocar): void {
    const confirmacao = confirm('Tem certeza que deseja excluir esta alocação?');
    if (confirmacao) {
      this.service.remove(alocacao._id).subscribe(() => {
        this.alocacoes = this.alocacoes.filter(e => e._id !== alocacao._id);
        this.onSucess(true);
      }, error => {
        console.error('Erro ao excluir evento:', error);
        this.onFailed();
      });
    }
  }

  onFailed() {
    this.snackBar.open(this.mensagemSnackbarErro, '', { duration: 5000, panelClass: ['errorSnackbar'] });
  }

  onSucess(excluir: boolean = false) {
    if (excluir) {
      this.snackBar.open('Evento excluído com sucesso', '', { duration: 5000, panelClass: ['successSnackbar'] });
      this.atualizaTabela();
    } else {
      this.snackBar.open(this.mensagemSnackbarAcerto, '', { duration: 5000, panelClass: ['successSnackbar'] });
    }
  }

}
