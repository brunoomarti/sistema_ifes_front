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
import JsBarcode from 'jsbarcode';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { SelectionModel } from '@angular/cdk/collections';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input'; // Import MatInputModule
import { catchError, tap, throwError } from 'rxjs';

@Component({
  selector: 'app-gerencia-aluno',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginator,
    MatFormField,
    MatLabel,
    MatCheckboxModule,
    MatInputModule // Add MatInputModule to imports
  ],
  templateUrl: './gerencia-aluno.component.html',
  styleUrls: ['./gerencia-aluno.component.css']
})
export class GerenciaAlunoComponent implements OnInit {
  alunos: any[] = [];
  dataSource: any;
  mensagemSnackbarAcerto: string = 'Aluno excluído com sucesso.';
  mensagemSnackbarErro: string = 'Erro ao excluir aluno.';
  selectedQuantity: number = 1; // Quantidade de etiquetas a ser impressa
  showBarcodeModal: boolean = false; // Controla a exibição do modal de seleção de quantidade de etiquetas
  selection = new SelectionModel<Aluno>(true, []); // Permitir seleção múltipla
  displayedColumns: string[] = ['select', 'name', 'course', 'studentCode', 'registrationYear', 'actions'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private service: AlunoService,
    private router: Router,
    private snackBar: MatSnackBar,
    public dialog: MatDialog
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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
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

  excluirSelecionados(): void {
    const selectedAlunos = this.selection.selected;
    if (selectedAlunos.length === 0) {
      this.snackBar.open("Nenhum aluno selecionado.", '', { duration: 5000, panelClass: ['errorSnackbar'] });
      return;
    }

    const confirmacao = confirm('Tem certeza que deseja excluir os alunos selecionados?');
    if (confirmacao) {
      const ids = selectedAlunos.map(aluno => aluno._id);
      this.service.removeMultiple(ids).pipe(
        tap(() => {
            this.alunos = this.alunos.filter(aluno => !ids.includes(aluno._id));
            this.onSucess(true);
            this.selection.clear();
        }),
        catchError((error: any) => {
          this.onFailed();
          this.selection.clear();
          return throwError(() => new Error(error));
        })
      ).subscribe();

    }
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

  handleImprimirSelecionadosClick() {
    const selectedAlunos = this.selection.selected;
    if (selectedAlunos.length === 0) {
      this.snackBar.open("Nenhum aluno selecionado.", '', { duration: 5000, panelClass: ['errorSnackbar'] });
    } else {
      this.imprimirEtiquetasSelecionados();
    }
    this.showBarcodeModal = true; // Abre o modal de seleção de quantidade
  }

  imprimirEtiquetasSelecionados() {
    const selectedAlunos = this.selection.selected;
    if (selectedAlunos.length === 0) {
      this.snackBar.open("Nenhum aluno selecionado.", '', { duration: 5000, panelClass: ['errorSnackbar'] });
      return;
    }

    const larguraEtiqueta = 38; // Largura individual da etiqueta em mm
    const larguraTotal = 3 * larguraEtiqueta; // Largura total em mm

    const printWindow = window.open("", "_blank", `width=${larguraTotal}mm`);

    let etiquetasContent = `
        <html>
            <head>
                <title>Etiquetas</title>
                <style>
                    @media print {
                        @page {
                            size: ${larguraTotal}mm 22mm;
                            margin: 0;
                        }
                        body {
                            margin: 0;
                            padding: 0;
                            display: flex;
                            flex-wrap: wrap;
                        }
                        .etiqueta {
                            width: ${larguraEtiqueta}mm;
                            height: 22mm; /* Ajustar a altura para caber na página */
                            box-sizing: border-box;
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            justify-content: center;
                            text-align: center;
                            page-break-inside: avoid;
                            page-break-after: auto;
                        }
                        img {
                            width: 95%;
                            height: 70%; /* Diminuir a altura do código de barras */
                        }
                        .matricula-text {
                            font-size: 12px;
                            font-weight: bold;
                        }
                    }
                </style>
            </head>
            <body>
    `;

    for (const aluno of selectedAlunos) {
      for (let i = 0; i < this.selectedQuantity; i++) {
        const canvas = document.createElement("canvas");
        JsBarcode(canvas, aluno.studentCode, {
          format: "CODE128",
          displayValue: false,
        });

        const imageData = canvas.toDataURL("image/png");

        etiquetasContent += `
            <div class="etiqueta">
                <img src="${imageData}" />
                <div class="matricula-text">${aluno.studentCode}</div>
            </div>
        `;
      }
    }

    etiquetasContent += `
            </body>
        </html>
    `;

    printWindow?.document.write(etiquetasContent);
    printWindow?.document.close();

    // Adicione um pequeno atraso antes de chamar o print
    setTimeout(() => {
        printWindow?.print();
    }, 500); // 500 milissegundos de atraso
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
