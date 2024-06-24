import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { TurmaService } from '../../service/turma.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Turma } from '../../../../../models/Turma';
import { EdicaoTurmaComponent } from '../../edicao-turma/edicao-turma.component';
import { ModalDialogOkComponent } from '../../../../modal-dialog/modal-dialog-ok/modal-dialog-ok.component';
import { MatSort, MatSortModule } from '@angular/material/sort';

@Component({
  selector: 'app-gerencia-turma',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatIcon,
    MatPaginator,
    MatSortModule
  ],
  templateUrl: './gerencia-turma.component.html',
  styleUrl: './gerencia-turma.component.css'
})
export class GerenciaTurmaComponent implements OnInit {

  readonly displayedColumns = ['name', 'actions'];

  turmas: Turma[] = [];
  dataSource = new MatTableDataSource<Turma>(this.turmas);
  mensagemSnackbarAcerto: string = 'Turma excluída com sucesso.';
  mensagemSnackbarErro: string = 'Erro ao excluir turma.';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private service: TurmaService,
    private router: Router,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.atualizaTabela();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  atualizaTabela() {
    this.service.listar().subscribe(turmas => {
      this.turmas = turmas;
      this.dataSource = new MatTableDataSource<Turma>(this.turmas);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.dataSource.sortingDataAccessor = (item: Turma, property: string) => {
        switch (property) {
          case 'name': return item.name.toLowerCase();
          default: return (item as any)[property];
        }
      };

      this.dataSource.filterPredicate = (data: Turma, filter: string) => {
        return data.name.toLowerCase().includes(filter);
      };
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
    this.service.getRegistrosUsandoTurma(turma._id).subscribe(registros => {
      if (registros.length > 0) {
        this.mostrarMensagemErro(registros);
      } else {
        const confirmacao = confirm('Tem certeza que deseja excluir este turma?');
        if (confirmacao) {
          this.service.remove(turma._id).subscribe(() => {
            this.turmas = this.turmas.filter(e => e._id !== turma._id);
            this.onSucess(true);
          }, error => {
            this.onFailed();
          });
        }
      }
    });
  }

  mostrarMensagemErro(registros: any[]): void {
    let cont = 1;

    const itensLista = registros.map(registro => {
        return `<span><strong>Alocação ${cont++}</strong></span> <br>
                Tipo: ${registro.type} - (${registro.weekDay})<br>
                Responsável: ${registro.lesson.teacher.name} <br>
        `;
    });

    const dialogDataForm = {
      title: 'Erro ao Excluir Turma',
      message: `
    <div mat-dialog-content>
      <p>Exclua os seguintes registros primeiramente:</p>
      <span>Total de Alocações: <strong>${itensLista.length}</strong></span>
      <ul>
        ${itensLista.map(item => `<li>${item}</li><br>`).join('')}
      </ul>
    </div>
  `,
    };

    this.dialog.open(ModalDialogOkComponent, {
      data: dialogDataForm,
      backdropClass: 'backdrop'
    });
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
