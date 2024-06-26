import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { DisciplinaService } from '../../service/disciplina.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Disciplina } from '../../../../../models/Disciplina';
import { EdicaoDisciplinaComponent } from '../../edicao-disciplina/edicao-disciplina.component';
import { ModalDialogOkComponent } from '../../../../modal-dialog/modal-dialog-ok/modal-dialog-ok.component';
import { MatSort, MatSortModule } from '@angular/material/sort';

@Component({
  selector: 'app-gerencia-disciplina',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatIcon,
    MatPaginator,
    MatSortModule
  ],
  templateUrl: './gerencia-disciplina.component.html',
  styleUrl: './gerencia-disciplina.component.css'
})
export class GerenciaDisciplinaComponent implements OnInit {

  disciplinas: Disciplina[] = [];
  dataSource = new MatTableDataSource<Disciplina>(this.disciplinas);
  mensagemSnackbarAcerto: string = 'Disciplina excluída com sucesso.';
  mensagemSnackbarErro: string = 'Erro ao excluir disciplina.';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private service: DisciplinaService,
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
    this.service.listar().subscribe(disciplinas => {
      this.disciplinas = disciplinas;
      this.dataSource = new MatTableDataSource<Disciplina>(this.disciplinas);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.dataSource.sortingDataAccessor = (item: Disciplina, property: string) => {
        switch (property) {
          case 'discipline': return item.name.toLowerCase();
          case 'course': return item.course.name.toLowerCase()
          default: return (item as any)[property];
        }
      };

      this.dataSource.filterPredicate = (data: Disciplina, filter: string) => {
        return data.name.toLowerCase().includes(filter) ||
                data.course.name.toLowerCase().includes(filter);
      };
    });
  }

  editar(disciplina: { name: string }): void {
    const dialogRef = this.dialog.open(EdicaoDisciplinaComponent, {
      disableClose: true,
      backdropClass: 'backdrop',
      data: { disciplina }
    });

    dialogRef.afterClosed().subscribe(() => {
      this.atualizaTabela();
    });
  }

  excluir(disciplina: Disciplina): void {
    this.service.getRegistrosUsandoDisciplina(disciplina._id).subscribe(registros => {
      if (registros.length > 0) {
        this.mostrarMensagemErro(registros);
      } else {
        const confirmacao = confirm('Tem certeza que deseja excluir este disciplina?');
        if (confirmacao) {
          this.service.remove(disciplina._id).subscribe(() => {
            this.disciplinas = this.disciplinas.filter(e => e._id !== disciplina._id);
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
        return `<span><strong>Aula ${cont++}</strong></span> <br>
                Disciplina: ${registro.discipline.name} (${registro.discipline.course.name})<br>
                Professor: ${registro.teacher.name} (${registro.teacher.teacherCode})<br>
        `;
    });

    const dialogDataForm = {
      title: 'Erro ao Excluir Horário',
      message: `
    <div mat-dialog-content>
      <p>Exclua os seguintes registros primeiramente:</p>
      <span>Total de Aula(s): <strong>${itensLista.length}</strong></span>
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
      this.snackBar.open('Disciplina excluída com sucesso', '', { duration: 5000, panelClass: ['successSnackbar'] });
      this.atualizaTabela();
    } else {
      this.snackBar.open(this.mensagemSnackbarAcerto, '', { duration: 5000, panelClass: ['successSnackbar'] });
    }
  }

  backPage() {
    this.router.navigate(['/cadastro-gerencia']);
  }

  cadastrar() {
    this.router.navigate(['/cadastro-gerencia/cadastro-disciplina']);
  }

}
