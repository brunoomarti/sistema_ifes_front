import { CommonModule, DatePipe } from '@angular/common';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Aluno } from '../../../../models/Aluno';
import { MatPaginator } from '@angular/material/paginator';
import { AulaService } from '../service/aula.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatricularAlunoAulaComponent } from '../matricular-aluno-aula/matricular-aluno-aula.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SelectionModel } from '@angular/cdk/collections';
import { catchError, tap, throwError } from 'rxjs';

@Component({
  selector: 'app-alunos-matriculados',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatIcon,
    MatPaginator,
    MatCheckboxModule
  ],
  templateUrl: './alunos-matriculados.component.html',
  styleUrls: ['./alunos-matriculados.component.css'],
  providers: [DatePipe]
})
export class AlunosMatriculadosComponent implements OnInit {

  alunos: Aluno[] = [];
  dataSource!: MatTableDataSource<Aluno>;
  mensagemSnackbarAcerto: string = 'Aluno desvinculado com sucesso.';
  mensagemSnackbarErro: string = 'Erro ao desvincular aluno.';
  aulaId: string = "";
  displayedColumns: string[] = ['select', 'student'];
  selection = new SelectionModel<Aluno>(true, []);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    public dialogRef: MatDialogRef<AlunosMatriculadosComponent>,
    private service: AulaService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  ngOnInit(): void {
    this.atualizaTabela();
  }

  atualizaTabela() {
    this.aulaId = this.data.aula._id.toString();

    this.service.listarAlunosPorAula(this.aulaId).subscribe(alunos => {
      this.alunos = alunos;
      this.dataSource = new MatTableDataSource<Aluno>(this.alunos);
      this.dataSource.paginator = this.paginator;
      this.dataSource.filterPredicate = (data: Aluno, filter: string) => {
        return data.name.toLowerCase().includes(filter) || data.studentCode.toString().includes(filter);
      };
    });
  }

  matricular(): void {
    const dialogRef = this.dialog.open(MatricularAlunoAulaComponent, {
      disableClose: false,
      backdropClass: 'backdropTwo',
      data: this.data
    });

    dialogRef.afterClosed().subscribe(() => {
      this.atualizaTabela();
    });
  }

  excluirSelecionados(): void {
    const selectedAlunos = this.selection.selected;
    if (selectedAlunos.length === 0) {
      this.snackBar.open("Nenhum aluno selecionado.", '', { duration: 5000, panelClass: ['errorSnackbar'] });
      return;
    }

    const confirmacao = confirm('Tem certeza que deseja desvincular os alunos selecionados da aula?');
    if (confirmacao) {
      const ids = selectedAlunos.map(aluno => aluno._id);
      this.service.removerAlunoDaAula(ids, this.aulaId).pipe(
        tap(() => {
          this.alunos = this.alunos.filter(aluno => !ids.includes(aluno._id));
          this.onSucess(true);
          this.selection.clear();
        }),
        catchError((error: any) => {
          console.error('Erro ao excluir alunos: ', error);
          this.onFailed();
          this.selection.clear();
          return throwError(() => new Error(error));
        })
      ).subscribe();
    }
  }

  onFailed() {
    this.snackBar.open(this.mensagemSnackbarErro, '', { duration: 5000, panelClass: ['errorSnackbar'] });
  }

  onSucess(excluir: boolean = false) {
    if (excluir) {
      this.snackBar.open('Aluno desvinculado com sucesso', '', { duration: 5000, panelClass: ['successSnackbar'] });
      this.atualizaTabela();
    } else {
      this.snackBar.open(this.mensagemSnackbarAcerto, '', { duration: 5000, panelClass: ['successSnackbar'] });
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  toggleSelection(aluno: Aluno) {
    this.selection.toggle(aluno);
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ? this.selection.clear() : this.dataSource.data.forEach((row: Aluno) => this.selection.select(row));
  }
}
