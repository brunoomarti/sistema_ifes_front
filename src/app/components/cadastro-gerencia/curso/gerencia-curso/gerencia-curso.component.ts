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
import { ModalDialogOkComponent } from '../../../modal-dialog/modal-dialog-ok/modal-dialog-ok.component';
import { MatSort, MatSortModule } from '@angular/material/sort';

@Component({
  selector: 'app-gerencia-curso',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatIcon,
    MatPaginator,
    MatSortModule
  ],
  templateUrl: './gerencia-curso.component.html',
  styleUrl: './gerencia-curso.component.css'
})
export class GerenciaCursoComponent implements OnInit {

  cursos: Curso[] = [];
  dataSource = new MatTableDataSource<Curso>(this.cursos);
  mensagemSnackbarAcerto: string = 'Curso excluído com sucesso.';
  mensagemSnackbarErro: string = 'Erro ao excluir curso.';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private service: CursoService,
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
    this.service.listar().subscribe(cursos => {
      this.cursos = cursos;
      this.dataSource = new MatTableDataSource<Curso>(this.cursos);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.dataSource.sortingDataAccessor = (item: Curso, property: string) => {
        switch (property) {
          case 'discipline': return item.name.toLowerCase();
          default: return (item as any)[property];
        }
      };

      this.dataSource.filterPredicate = (data: Curso, filter: string) => {
        return data.name.toLowerCase().includes(filter);
      };
    });
  }

  editar(obj: Curso) {
    const dialogRef = this.dialog.open(EdicaoCursoComponent, {
      disableClose: true,
      backdropClass: 'backdrop',
      data: { obj }
    });


    dialogRef.afterClosed().subscribe(() => {
      this.atualizaTabela();
    });
  }

  excluir(obj: Curso): void {
    this.service.getRegistrosUsandoCurso(obj._id).subscribe(registros => {
      if (registros.length > 0) {
        this.mostrarMensagemErro(registros);
      } else {
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
    });
  }


  mostrarMensagemErro(registros: any[]): void {
    registros.map((a) => { console.log()})

    const itensLista = registros.map(registro => {
      if (registro.acronym) {
        return `Disciplina: ${registro.name}`;
      } else{
        return `Aluno: ${registro.name} (${registro.studentCode})`;
      }
    });

    const dialogDataForm = {
      title: 'Erro ao Excluir Curso',
      message: `
    <div mat-dialog-content>
      <p>Exclua os seguintes registros primeiramente:</p>
      <ul>
        ${itensLista.map(item => `<li>${item}</li>`).join('')}
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
