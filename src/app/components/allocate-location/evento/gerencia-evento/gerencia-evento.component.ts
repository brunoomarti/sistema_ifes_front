import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Evento } from '../../../../models/Evento';
import { EventoService } from '../service/evento.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReloadService } from '../../../../shared-services/reload.service';
import { MatDialog } from '@angular/material/dialog';
import { EdicaoEventoComponent } from '../edicao-evento/edicao-evento.component';
import { AlocaEventoComponent } from '../aloca-evento/aloca-evento.component';

@Component({
  selector: 'app-gerencia-evento',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatIcon,
    MatPaginator
  ],
  templateUrl: './gerencia-evento.component.html',
  styleUrl: './gerencia-evento.component.css'
})
export class GerenciaEventoComponent implements OnInit {

  eventos: Evento[] = [];
  dataSource: any;
  mensagemSnackbarAcerto: string = 'Evento excluído com sucesso.';
  mensagemSnackbarErro: string = 'Erro ao excluir evento.';
  hoverText: string = 'Não alocado';

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private service: EventoService,
    private router: Router,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private reloadService: ReloadService,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.atualizaTabela();
  }

  atualizaTabela() {
    this.service.listar().subscribe(eventos => {
      this.eventos = eventos;
      this.dataSource = new MatTableDataSource<Evento>(this.eventos);
      this.dataSource.paginator = this.paginator;
    });
  }

  editar(evento: { name: string }): void {
    const dialogRef = this.dialog.open(EdicaoEventoComponent, {
      disableClose: true,
      backdropClass: 'backdrop',
      data: { evento }
    });

    dialogRef.afterClosed().subscribe(() => {
      this.atualizaTabela();
    });
  }

  excluir(evento: Evento): void {
    const confirmacao = confirm('Tem certeza que deseja excluir este evento?');
    if (confirmacao) {
      this.service.remove(evento._id).subscribe(() => {
        this.eventos = this.eventos.filter(e => e._id !== evento._id);
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

  backPage() {
    this.router.navigate(['/alocar-local']);
  }

  cadastrar() {
    this.router.navigate(['/alocar-local/cadastro-evento']);
  }

  alocarEvento(evento: Evento): void {
    const dialogRef = this.dialog.open(AlocaEventoComponent, {
      disableClose: true,
      backdropClass: 'backdrop',
      data: { evento }
    });

    dialogRef.afterClosed().subscribe(() => {
      this.atualizaTabela();
    });
  }

  changeText(text: string, isHovering: boolean) {
    if (isHovering) {
      this.hoverText = text === 'alocar' ? 'Alocar agora' : this.hoverText;
    } else {
      this.hoverText = text === 'alocar' ? 'Não alocado' : this.hoverText;
    }
  }

}
