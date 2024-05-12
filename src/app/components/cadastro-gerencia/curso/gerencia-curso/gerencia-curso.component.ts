import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CursoService } from '../service/curso.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Curso } from '../../../../models/Curso';
import { EdicaoCursoComponent } from '../edicao-curso/edicao-curso.component';

@Component({
  selector: 'app-gerencia-curso',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatIcon,
    MatPaginator
  ],
  templateUrl: './gerencia-curso.component.html',
  styleUrl: './gerencia-curso.component.css'
})
export class GerenciaCursoComponent implements OnInit {

  cursos: any[] = [];
  dataSource: any;
  mensagemSnackbarAcerto: string = 'Curso excluído com sucesso.';
  mensagemSnackbarErro: string = 'Erro ao excluir curso.';

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private service: CursoService,
    private router: Router,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.atualizaTabela();
  }

  atualizaTabela() {
    this.service.listar().subscribe(cursos => {
      this.cursos = cursos;
      this.dataSource = new MatTableDataSource<Curso>(this.cursos);
      this.dataSource.paginator = this.paginator;
    });
  }

  editar(obj: Curso) {
    const dialogRef = this.dialog.open(EdicaoCursoComponent, {
      disableClose: true,
      backdropClass: 'backdrop',
      data: { obj }
    });

    console.log(obj);

    dialogRef.afterClosed().subscribe(() => {
      this.atualizaTabela();
    });
  }

  excluir(obj: Curso): void {
    const confirmacao = confirm('Tem certeza que deseja excluir este curso?');
    if (confirmacao) {
      this.service.remove(obj._id).subscribe(() => {
        this.cursos = this.cursos.filter(e => e._id !== obj._id);
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
      this.snackBar.open(this.mensagemSnackbarAcerto, '', { duration: 5000, panelClass: ['successSnackbar'] });
      this.atualizaTabela();
    } else {
      this.snackBar.open(this.mensagemSnackbarErro, '', { duration: 5000, panelClass: ['successSnackbar'] });
    }
  }

  backPage() {
    this.router.navigate(['/cadastro-gerencia']);
  }

  cadastrar() {
    this.router.navigate(['/cadastro-gerencia/cadastro-curso']);
  }

}
