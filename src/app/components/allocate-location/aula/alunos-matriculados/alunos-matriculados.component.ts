import { Aula } from './../../../../models/Aula';
import { CommonModule, DatePipe } from '@angular/common';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReloadService } from '../../../../shared-services/reload.service';
import { Aluno } from '../../../../models/Aluno';
import { MatPaginator } from '@angular/material/paginator';
import { AulaService } from '../service/aula.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatricularAlunoAulaComponent } from '../matricular-aluno-aula/matricular-aluno-aula.component';

@Component({
  selector: 'app-alunos-matriculados',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatIcon,
    MatPaginator
  ],
  templateUrl: './alunos-matriculados.component.html',
  styleUrl: './alunos-matriculados.component.css',
  providers: [DatePipe]
})
export class AlunosMatriculadosComponent implements OnInit {

  alunos: any[] = [];
  dataSource: any;
  mensagemSnackbarAcerto: string = 'Aluno desvinculado com sucesso.';
  mensagemSnackbarErro: string = 'Erro ao desvincular aluno.';

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    public dialogRef: MatDialogRef<AlunosMatriculadosComponent>,
    private service: AulaService,
    private snackBar: MatSnackBar,
    private reloadService: ReloadService,
    private datePipe: DatePipe,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
  }

  ngOnInit(): void {
    this.atualizaTabela();
  }

  atualizaTabela() {

    const aulaId = this.data.aula._id.toString();

    this.service.listarAlunosPorAula(aulaId).subscribe(alunos => {
      this.alunos = alunos;
      this.dataSource = new MatTableDataSource<Aluno>(this.alunos);
      this.dataSource.paginator = this.paginator;
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

  excluir(aluno: Aluno): void {
    const confirmacao = confirm('Tem certeza que deseja desvincular este aluno da aula?');
    if (confirmacao) {
      this.service.remove(aluno._id).subscribe(() => {
        this.alunos = this.alunos.filter(e => e._id !== aluno._id);
        this.onSucess(true);
      }, error => {
        console.error('Erro ao excluir aula: ', error);
        this.onFailed();
      });
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

}
