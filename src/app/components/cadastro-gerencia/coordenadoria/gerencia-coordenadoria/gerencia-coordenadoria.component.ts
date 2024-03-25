import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CoordenadoriaService } from '../service/coordenadoria.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Coordenadoria } from '../../../../models/Coordenadoria';
import { EdicaoCoordenadoriaComponent } from '../edicao-coordenadoria/edicao-coordenadoria.component';

@Component({
  selector: 'app-gerencia-coordenadoria',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatIcon,
    MatPaginator
  ],
  templateUrl: './gerencia-coordenadoria.component.html',
  styleUrl: './gerencia-coordenadoria.component.css'
})
export class GerenciaCoordenadoriaComponent implements OnInit {

  coordenadorias: any[] = [];
  dataSource: any;
  mensagemSnackbarAcerto: string = 'Coordenadoria excluída com sucesso.';
  mensagemSnackbarErro: string = 'Erro ao excluir coordenadoria.';

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private service: CoordenadoriaService,
    private router: Router,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.atualizaTabela();
  }

  atualizaTabela() {
    this.service.listar().subscribe(coordenadorias => {
      this.coordenadorias = coordenadorias;
      this.dataSource = new MatTableDataSource<Coordenadoria>(this.coordenadorias);
      this.dataSource.paginator = this.paginator;
    });
  }

  editar(coordenadoria: { name: string }): void {
    const dialogRef = this.dialog.open(EdicaoCoordenadoriaComponent, {
      disableClose: true,
      backdropClass: 'backdrop',
      data: { coordenadoria }
    });

    dialogRef.afterClosed().subscribe(() => {
      this.atualizaTabela();
    });
  }

  excluir(coordenadoria: Coordenadoria): void {
    const confirmacao = confirm('Tem certeza que deseja excluir esta coordenadoria?');
    if (confirmacao) {
      this.service.remove(coordenadoria._id).subscribe(() => {
        this.coordenadorias = this.coordenadorias.filter(e => e._id !== coordenadoria._id);
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
      this.snackBar.open('Coordenadoria excluída com sucesso', '', { duration: 5000, panelClass: ['successSnackbar'] });
      this.atualizaTabela();
    } else {
      this.snackBar.open(this.mensagemSnackbarAcerto, '', { duration: 5000, panelClass: ['successSnackbar'] });
    }
  }

  backPage() {
    this.router.navigate(['/cadastro-gerencia']);
  }

  verDescricao(coordenadoria: Coordenadoria): void {

  }

}
