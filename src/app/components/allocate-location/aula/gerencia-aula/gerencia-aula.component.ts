import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { AulaService } from '../service/aula.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { ReloadService } from '../../../../shared-services/reload.service';
import { MatDialog } from '@angular/material/dialog';
import { Aula } from '../../../../models/Aula';
import { EdicaoAulaComponent } from '../edicao-aula/edicao-aula.component';

@Component({
  selector: 'app-gerencia-aula',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatIcon,
    MatPaginator
  ],
  templateUrl: './gerencia-aula.component.html',
  styleUrl: './gerencia-aula.component.css'
})
export class GerenciaAulaComponent implements OnInit {

  aulas: any[] = [];
  dataSource: any;
  mensagemSnackbarAcerto: string = 'Disciplina excluída com sucesso.';
  mensagemSnackbarErro: string = 'Erro ao excluir disciplina.';

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private service: AulaService,
    private router: Router,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.atualizaTabela();
  }

  atualizaTabela() {
    this.service.listar().subscribe(aulas => {
      this.aulas = aulas;
      this.dataSource = new MatTableDataSource<Aula>(this.aulas);
      this.dataSource.paginator = this.paginator;
    });
  }

  editar(aula: { name: string }): void {
    const dialogRef = this.dialog.open(EdicaoAulaComponent, {
      disableClose: true,
      backdropClass: 'backdrop',
      data: { aula }
    });

    dialogRef.afterClosed().subscribe(() => {
      this.atualizaTabela();
    });
  }

  excluir(aula: Aula): void {
    const confirmacao = confirm('Tem certeza que deseja excluir esta aula?');
    if (confirmacao) {
      this.service.remove(aula._id).subscribe(() => {
        this.aulas = this.aulas.filter(e => e._id !== aula._id);
        this.onSucess(true);
      }, error => {
        console.error('Erro ao excluir aula: ', error);
        this.onFailed();
      });
    }
  }

  onFailed() {
    this.snackBar.open(this.mensagemSnackbarErro, '', { duration: 5000, panelClass: ['errorSnackbar'] });
  }

  onSucess(excluir: boolean = false) {
    if (excluir) {
      this.snackBar.open('Aula excluída com sucesso', '', { duration: 5000, panelClass: ['successSnackbar'] });
      this.atualizaTabela();
    } else {
      this.snackBar.open(this.mensagemSnackbarAcerto, '', { duration: 5000, panelClass: ['successSnackbar'] });
    }
  }

  backPage() {
    this.router.navigate(['/alocar-local']);
  }

  cadastrar() {
    this.router.navigate(['/alocar-local/cadastro-aula']);
  }

}
