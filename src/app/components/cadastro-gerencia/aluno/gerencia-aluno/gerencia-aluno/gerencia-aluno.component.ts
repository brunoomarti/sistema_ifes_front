import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { AlunoService } from '../../service/aluno.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Aluno } from '../../../../../models/Aluno';
import { EdicaoAlunoComponent } from '../../edicao-aluno/edicao-aluno.component';

@Component({
  selector: 'app-gerencia-aluno',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatIcon,
    MatPaginator
  ],
  templateUrl: './gerencia-aluno.component.html',
  styleUrl: './gerencia-aluno.component.css'
})
export class GerenciaAlunoComponent implements OnInit {

  alunos: any[] = [];
  dataSource: any;
  mensagemSnackbarAcerto: string = 'Aluno excluído com sucesso.';
  mensagemSnackbarErro: string = 'Erro ao excluir aluno.';

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private service: AlunoService,
    private router: Router,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.atualizaTabela();
  }

  atualizaTabela() {
    this.service.listar().subscribe(alunos => {
      this.alunos = alunos;
      this.dataSource = new MatTableDataSource<Aluno>(this.alunos);
      this.dataSource.paginator = this.paginator;
    });
  }

  editar(aluno: { name: string }): void {
    const dialogRef = this.dialog.open(EdicaoAlunoComponent, {
      disableClose: true,
      backdropClass: 'backdrop',
      data: { aluno }
    });

    dialogRef.afterClosed().subscribe(() => {
      this.atualizaTabela();
    });
  }

  excluir(aluno: Aluno): void {
    const confirmacao = confirm('Tem certeza que deseja excluir este aluno?');
    if (confirmacao) {
      this.service.remove(aluno._id).subscribe(() => {
        this.alunos = this.alunos.filter(e => e._id !== aluno._id);
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
      this.snackBar.open('Aluno excluído com sucesso', '', { duration: 5000, panelClass: ['successSnackbar'] });
      this.atualizaTabela();
    } else {
      this.snackBar.open(this.mensagemSnackbarAcerto, '', { duration: 5000, panelClass: ['successSnackbar'] });
    }
  }

  backPage() {
    this.router.navigate(['/cadastro-gerencia']);
  }

}
