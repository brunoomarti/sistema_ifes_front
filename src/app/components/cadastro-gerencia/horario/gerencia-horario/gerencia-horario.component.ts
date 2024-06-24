import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { HorarioService } from '../service/horario.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Horario } from '../../../../models/Horario';
import { EdicaoHorarioComponent } from '../edicao-horario/edicao-horario.component';
import { ModalDialogOkComponent } from '../../../modal-dialog/modal-dialog-ok/modal-dialog-ok.component';
import { MatSort, MatSortModule } from '@angular/material/sort';

@Component({
  selector: 'app-gerencia-horario',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatIcon,
    MatPaginator,
    MatSortModule
  ],
  templateUrl: './gerencia-horario.component.html',
  styleUrls: ['./gerencia-horario.component.css']
})
export class GerenciaHorarioComponent implements OnInit {

  horarios: Horario[] = [];
  dataSource: MatTableDataSource<Horario> = new MatTableDataSource();
  mensagemSnackbarAcerto: string = 'Horário excluído com sucesso.';
  mensagemSnackbarErro: string = 'Erro ao excluir horário.';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = ['startTime', 'discipline', 'endTime', 'actions']; // Adicione as colunas que você tem no seu template

  constructor(
    private service: HorarioService,
    private router: Router,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.atualizaTabela();
  }

  atualizaTabela() {
    this.service.listar().subscribe(horarios => {
      this.horarios = horarios;
      this.dataSource.data = this.horarios;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

      // Defina a ordenação inicial
      this.sort.active = 'startTime';
      this.sort.direction = 'asc';
      this.dataSource.sort = this.sort;
    });
  }

  editar(horario: { startTime: string, endTime: string }): void {
    const dialogRef = this.dialog.open(EdicaoHorarioComponent, {
      disableClose: true,
      backdropClass: 'backdrop',
      data: { horario }
    });

    dialogRef.afterClosed().subscribe(() => {
      this.atualizaTabela();
    });
  }

  excluir(horario: Horario): void {
    this.service.getRegistrosUsandoHorario(horario._id).subscribe(registros => {
      if (registros.length > 0) {
        this.mostrarMensagemErro(registros);
      } else {
        const confirmacao = confirm('Tem certeza que deseja excluir este horario?');
        if (confirmacao) {
          this.service.remove(horario._id).subscribe(() => {
            this.horarios = this.horarios.filter(e => e._id !== horario._id);
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
      title: 'Erro ao Excluir Horário',
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
      this.snackBar.open('Horário excluído com sucesso', '', { duration: 5000, panelClass: ['successSnackbar'] });
      this.atualizaTabela();
    } else {
      this.snackBar.open(this.mensagemSnackbarAcerto, '', { duration: 5000, panelClass: ['successSnackbar'] });
    }
  }

  backPage() {
    this.router.navigate(['/cadastro-gerencia']);
  }

  cadastrar() {
    this.router.navigate(['/cadastro-gerencia/cadastro-horario']);
  }
}
