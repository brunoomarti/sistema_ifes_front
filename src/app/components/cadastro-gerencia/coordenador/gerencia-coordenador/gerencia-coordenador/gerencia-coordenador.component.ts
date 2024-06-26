import { EdicaoCoordenadorComponent } from './../../edicao-coordenador/edicao-coordenador/edicao-coordenador.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { CoordenadorService } from '../../service/coordenador.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIcon } from '@angular/material/icon';
import { Coordenador } from '../../../../../models/Coordenador';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';

@Component({
  selector: 'app-gerencia-coordenador',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatIcon,
    MatPaginator,
    MatSort,
    MatSortModule
  ],
  templateUrl: './gerencia-coordenador.component.html',
  styleUrl: './gerencia-coordenador.component.css'
})
export class GerenciaCoordenadorComponent implements OnInit {

  readonly displayedColumns = ['name', 'coordination', 'actions'];

  coordenadores: any[] = [];
  dataSource: any;
  mensagemSnackbarAcerto: string = 'Coordenador excluído com sucesso.';
  mensagemSnackbarErro: string = 'Erro ao excluir coordenador.';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private service: CoordenadorService,
    private router: Router,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.atualizaTabela();
    console.log(this.coordenadores)
  }

  atualizaTabela() {
    this.service.listar().subscribe(coordenadores => {
      this.coordenadores = coordenadores;
      this.dataSource = new MatTableDataSource<Coordenador>(this.coordenadores);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  editar(coordenador: { name: string }): void {
    const dialogRef = this.dialog.open(EdicaoCoordenadorComponent, {
      disableClose: true,
      backdropClass: 'backdrop',
      data: { coordenador }
    });

    dialogRef.afterClosed().subscribe(() => {
      this.atualizaTabela();
    });
  }

  excluir(coordenador: Coordenador): void {
    const confirmacao = confirm('Tem certeza que deseja excluir este coordenador?');
    if (confirmacao) {
      this.service.remove(coordenador._id).subscribe(() => {
        this.coordenadores = this.coordenadores.filter(e => e._id !== coordenador._id);
        this.onSucess(true);
      }, error => {
        console.error('Erro ao excluir coordenador.', error);
        this.onFailed();
      });
    }
  }

  onFailed() {
    this.snackBar.open(this.mensagemSnackbarErro, '', { duration: 5000, panelClass: ['errorSnackbar'] });
  }

  onSucess(excluir: boolean = false) {
    if (excluir) {
      this.snackBar.open('Coordenador excluído com sucesso', '', { duration: 5000, panelClass: ['successSnackbar'] });
      this.atualizaTabela();
    } else {
      this.snackBar.open(this.mensagemSnackbarAcerto, '', { duration: 5000, panelClass: ['successSnackbar'] });
    }
  }

  backPage() {
    this.router.navigate(['/cadastro-gerencia']);
  }

  cadastrar() {
    this.router.navigate(['/cadastro-gerencia/cadastro-coordenador']);
  }

}
