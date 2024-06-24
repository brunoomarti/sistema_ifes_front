import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { LocalService } from '../service/local.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Local } from '../../../../models/Local';
import { EdicaoLocalComponent } from '../edicao-local/edicao-local.component';
import { EquipamentoLocal } from '../../../../models/EquipamentoLocal';
import { ModalDialogOkComponent } from '../../../modal-dialog/modal-dialog-ok/modal-dialog-ok.component';
import { MatSort, MatSortModule } from '@angular/material/sort';

@Component({
  selector: 'app-gerencia-local',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatIcon,
    MatPaginator,
    NgIf,
    NgFor,
    MatSortModule
  ],
  templateUrl: './gerencia-local.component.html',
  styleUrl: './gerencia-local.component.css'
})
export class GerenciaLocalComponent implements OnInit {

  locais: Local[] = [];
  dataSource = new MatTableDataSource<Local>(this.locais);
  itensInseridos: EquipamentoLocal[] = [];
  mensagemSnackbarAcerto: string = 'Local excluído com sucesso.';
  mensagemSnackbarErro: string = 'Erro ao excluir local.';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private service: LocalService,
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
    this.service.listar().subscribe(locais => {
      this.locais = locais;
      this.dataSource = new MatTableDataSource<Local>(this.locais);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.dataSource.sortingDataAccessor = (item: Local, property: string) => {
        switch (property) {
          case 'name': return item.name.toLowerCase();
          default: return (item as any)[property];
        }
      };

      this.dataSource.filterPredicate = (data: Local, filter: string) => {
        return data.name.toLowerCase().includes(filter);
      };
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
    this.service.getRegistrosUsandoLocal(local._id).subscribe(registros => {
      if (registros.length > 0) {
        this.mostrarMensagemErro(registros);
      } else {
        const confirmacao = confirm('Tem certeza que deseja excluir este local?');
        if (confirmacao) {
          this.service.remove(local._id).subscribe(() => {
            this.locais = this.locais.filter(e => e._id !== local._id);
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
        return `<span>Alocação <strong>${cont++}</strong></span> <br>
                Tipo: ${registro.type} - (${registro.weekDay})<br>
                Responsável: ${registro.lesson.teacher.name} <br>
                Local: ${registro.location.name}
        `;
    });

    const dialogDataForm = {
      title: 'Erro ao Excluir Local',
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
