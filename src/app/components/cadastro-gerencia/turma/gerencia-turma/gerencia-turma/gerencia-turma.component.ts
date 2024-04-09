import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { TurmaService } from '../../service/turma.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReloadService } from '../../../../../shared-services/reload.service';
import { MatDialog } from '@angular/material/dialog';
import { Turma } from '../../../../../models/Turma';
import { EdicaoTurmaComponent } from '../../edicao-turma/edicao-turma.component';

@Component({
  selector: 'app-gerencia-turma',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatIcon,
    MatPaginator
  ],
  templateUrl: './gerencia-turma.component.html',
  styleUrl: './gerencia-turma.component.css'
})
export class GerenciaTurmaComponent implements OnInit {

  readonly displayedColumns = ['name', 'actions'];

  turmas: any[] = [];
  dataSource: any;
  mensagemSnackbarAcerto: string = 'Turma excluída com sucesso.';
  mensagemSnackbarErro: string = 'Erro ao excluir turma.';

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private service: TurmaService,
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
    this.service.listar().subscribe(turmas => {
      this.turmas = turmas;
      this.dataSource = new MatTableDataSource<Turma>(this.turmas);
      this.dataSource.paginator = this.paginator;
    });
  }

  editar(turma: { name: string }): void {
    const dialogRef = this.dialog.open(EdicaoTurmaComponent, {
      disableClose: true,
      backdropClass: 'backdrop',
      data: { turma }
    });

    dialogRef.afterClosed().subscribe(() => {
      this.atualizaTabela();
    });
  }

  excluir(turma: Turma): void {
    const confirmacao = confirm('Tem certeza que deseja excluir esta turma?');
    if (confirmacao) {
      this.service.remove(turma._id).subscribe(() => {
        this.turmas = this.turmas.filter(e => e._id !== turma._id);
        this.onSucess(true);
      }, error => {
        console.error('Erro ao excluir equipamento:', error);
        this.onFailed();
      });
    }
  }

  onFailed() {
    this.snackBar.open(this.mensagemSnackbarErro, '', { duration: 5000, panelClass: ['errorSnackbar'] });
  }

  onSucess(excluir: boolean = false) {
    if (excluir) {
      this.snackBar.open('Turma excluída com sucesso', '', { duration: 5000, panelClass: ['successSnackbar'] });
      this.atualizaTabela();
    } else {
      this.snackBar.open(this.mensagemSnackbarAcerto, '', { duration: 5000, panelClass: ['successSnackbar'] });
    }
  }

  backPage() {
    this.router.navigate(['/cadastro-gerencia']);
  }

  cadastrar() {
    this.router.navigate(['/cadastro-gerencia/cadastro-turma']);
  }

}
