import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { AlunoService } from '../../service/aluno.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Aluno } from '../../../../../models/Aluno';
import { EdicaoAlunoComponent } from '../../edicao-aluno/edicao-aluno.component';
import { ModalDialogOkComponent } from '../../../../modal-dialog/modal-dialog-ok/modal-dialog-ok.component';
import { CommonModule } from '@angular/common';
import { JanelaSelectBarcodeComponent } from '../../janela-select-barcode/janela-select-barcode.component';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';

@Component({
  selector: 'app-gerencia-aluno',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginator,
    MatFormField,
    MatOption,
    MatSelect,
    MatLabel
  ],
  templateUrl: './gerencia-aluno.component.html',
  styleUrls: ['./gerencia-aluno.component.css']
})
export class GerenciaAlunoComponent implements OnInit {

  alunos: any[] = [];
  dataSource: any;
  mensagemSnackbarAcerto: string = 'Aluno excluído com sucesso.';
  mensagemSnackbarErro: string = 'Erro ao excluir aluno.';
  selectedPosition: string = 'right';

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private service: AlunoService,
    private router: Router,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    private http: HttpClient
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
    this.service.getRegistrosUsandoAluno(aluno._id).subscribe(registros => {
      if (registros.length > 0) {
        this.mostrarMensagemErro(registros);
      } else {
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
    });
  }

  mostrarMensagemErro(registros: any[]): void {
    let cont = 1;

    const itensLista = registros.map(registro => {
      return `<span><strong>Aula ${cont++}</strong></span> <br>
              Disciplina: ${registro.discipline.name} - (${registro.discipline.course.name})<br>
              Professor: ${registro.teacher.name} <br>
      `;
    });

    const dialogDataForm = {
      title: 'Erro ao Excluir Aluno',
      message: `
    <div mat-dialog-content>
      <p>Exclua os seguintes registros primeiramente:</p>
      <span>Total de aulas do aluno: <strong>${itensLista.length}</strong></span>
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
      this.snackBar.open('Aluno excluído com sucesso', '', { duration: 5000, panelClass: ['successSnackbar'] });
      this.atualizaTabela();
    } else {
      this.snackBar.open(this.mensagemSnackbarAcerto, '', { duration: 5000, panelClass: ['successSnackbar'] });
    }
  }

  backPage() {
    this.router.navigate(['/cadastro-gerencia']);
  }

  cadastrar() {
    this.router.navigate(['/cadastro-gerencia/cadastro-aluno']);
  }

  printBarcode() {
    if (this.alunos.length > 0) {
      const aluno = this.alunos[0];
      const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

      this.http.post('/api/print-barcode', { matricula: aluno.studentCode, position: 'center' }, { headers, responseType: 'blob' })
        .subscribe(response => {
          console.log('Código de barras enviado para impressão');
          this.snackBar.open('Código de barras enviado para impressão', '', { duration: 5000, panelClass: ['successSnackbar'] });
        }, error => {
          console.error('Erro ao enviar código de barras para impressão', error);
          this.snackBar.open('Erro ao enviar código de barras para impressão', '', { duration: 5000, panelClass: ['errorSnackbar'] });
        });
    }
  }

  setPosition(position: string) {
    this.selectedPosition = position;
  }

  openBarcodePrintWindow() {
    this.dialog.open(JanelaSelectBarcodeComponent, {
      backdropClass: 'backdrop'
    });
  }
}
