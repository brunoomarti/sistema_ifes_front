import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { LocalService } from '../service/local.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReloadService } from '../../../../shared-services/reload.service';
import { MatDialog } from '@angular/material/dialog';
import { Local } from '../../../../models/Local';
import { EdicaoLocalComponent } from '../edicao-local/edicao-local.component';

@Component({
  selector: 'app-gerencia-local',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatIcon,
    MatPaginator
  ],
  templateUrl: './gerencia-local.component.html',
  styleUrl: './gerencia-local.component.css'
})
export class GerenciaLocalComponent implements OnInit {

  locais: any[] = [];
  dataSource: any;
  mensagemSnackbarAcerto: string = 'Local excluído com sucesso.';
  mensagemSnackbarErro: string = 'Erro ao excluir local.';

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private service: LocalService,
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
    this.service.listar().subscribe(locais => {
      this.locais = locais;
      this.dataSource = new MatTableDataSource<Local>(this.locais);
      this.dataSource.paginator = this.paginator;
    });
  }

  editar(local: { name: string }): void {
    const dialogRef = this.dialog.open(EdicaoLocalComponent, {
      disableClose: true,
      backdropClass: 'backdrop',
      data: { local }
    });

    dialogRef.afterClosed().subscribe(() => {
      this.atualizaTabela();
    });
  }

  excluir(local: Local): void {
    const confirmacao = confirm('Tem certeza que deseja excluir este local?');
    if (confirmacao) {
      this.service.remove(local._id).subscribe(() => {
        this.locais = this.locais.filter(e => e._id !== local._id);
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
      this.snackBar.open('Local excluído com sucesso', '', { duration: 5000, panelClass: ['successSnackbar'] });
      this.atualizaTabela();
    } else {
      this.snackBar.open(this.mensagemSnackbarAcerto, '', { duration: 5000, panelClass: ['successSnackbar'] });
    }
  }

  backPage() {
    this.router.navigate(['/cadastro-gerencia']);
  }

  cadastrar() {
    this.router.navigate(['/cadastro-gerencia/cadastro-local']);
  }

}
