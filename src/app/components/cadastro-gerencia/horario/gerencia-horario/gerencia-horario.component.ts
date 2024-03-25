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

@Component({
  selector: 'app-gerencia-horario',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatIcon,
    MatPaginator
  ],
  templateUrl: './gerencia-horario.component.html',
  styleUrl: './gerencia-horario.component.css'
})
export class GerenciaHorarioComponent implements OnInit {

  horarios: any[] = [];
  dataSource: any;
  mensagemSnackbarAcerto: string = 'Horário excluído com sucesso.';
  mensagemSnackbarErro: string = 'Erro ao excluir horário.';

  @ViewChild(MatPaginator) paginator!: MatPaginator;

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
      this.dataSource = new MatTableDataSource<Horario>(this.horarios);
      this.dataSource.paginator = this.paginator;
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
    const confirmacao = confirm('Tem certeza que deseja excluir este horário?');
    if (confirmacao) {
      this.service.remove(horario._id).subscribe(() => {
        this.horarios = this.horarios.filter(e => e._id !== horario._id);
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
      this.snackBar.open('Horário excluído com sucesso', '', { duration: 5000, panelClass: ['successSnackbar'] });
      this.atualizaTabela();
    } else {
      this.snackBar.open(this.mensagemSnackbarAcerto, '', { duration: 5000, panelClass: ['successSnackbar'] });
    }
  }

  backPage() {
    this.router.navigate(['/cadastro-gerencia']);
  }

}
