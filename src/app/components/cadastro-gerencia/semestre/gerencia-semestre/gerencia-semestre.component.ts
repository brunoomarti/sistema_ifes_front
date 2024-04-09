import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { SemestreService } from '../service/semestre.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Semestre } from '../../../../models/Semestre';
import { EdicaoSemestreComponent } from '../edicao-semestre/edicao-semestre.component';

@Component({
  selector: 'app-gerencia-semestre',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatIcon,
    MatPaginator
  ],
  templateUrl: './gerencia-semestre.component.html',
  styleUrl: './gerencia-semestre.component.css'
})
export class GerenciaSemestreComponent implements OnInit {

  semestres: any[] = [];
  dataSource: any;
  mensagemSnackbarAcerto: string = 'Semestre excluído com sucesso.';
  mensagemSnackbarErro: string = 'Erro ao excluir semestre.';

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private service: SemestreService,
    private router: Router,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.atualizaTabela();
  }

  atualizaTabela() {
    this.service.listar().subscribe(semestres => {
      this.semestres = semestres;
      this.dataSource = new MatTableDataSource<Semestre>(this.semestres);
      this.dataSource.paginator = this.paginator;
    });
  }

  editar(semestre: { semester: string }): void {
    const dialogRef = this.dialog.open(EdicaoSemestreComponent, {
      disableClose: true,
      backdropClass: 'backdrop',
      data: { semestre }
    });

    dialogRef.afterClosed().subscribe(() => {
      this.atualizaTabela();
    });
  }

  excluir(semestre: Semestre): void {
    const confirmacao = confirm('Tem certeza que deseja excluir este semestre?');
    if (confirmacao) {
      this.service.remove(semestre._id).subscribe(() => {
        this.semestres = this.semestres.filter(e => e._id !== semestre._id);
        this.onSucess(true);
      }, error => {
        this.onFailed();
      });
    }
  }

  onFailed() {
    this.snackBar.open(this.mensagemSnackbarErro, '', { duration: 5000, panelClass: ['errorSnackbar'] });
  }

  onSucess(excluir: boolean = false) {
    if (excluir) {
      this.snackBar.open('Semestre excluído com sucesso', '', { duration: 5000, panelClass: ['successSnackbar'] });
      this.atualizaTabela();
    } else {
      this.snackBar.open(this.mensagemSnackbarAcerto, '', { duration: 5000, panelClass: ['successSnackbar'] });
    }
  }

  backPage() {
    this.router.navigate(['/cadastro-gerencia']);
  }

  cadastrar() {
    this.router.navigate(['/cadastro-gerencia/cadastro-semestre']);
  }

}
