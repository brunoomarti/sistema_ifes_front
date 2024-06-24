import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ProfessorService } from '../service/professor.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Professor } from '../../../../models/Professor';
import { EdicaoProfessorComponent } from '../edicao-professor/edicao-professor.component';
import { ModalDialogOkComponent } from '../../../modal-dialog/modal-dialog-ok/modal-dialog-ok.component';
import { MatSort, MatSortModule } from '@angular/material/sort';

@Component({
  selector: 'app-gerencia-professor',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatIcon,
    MatPaginator,
    MatSort,
    MatSortModule
  ],
  templateUrl: './gerencia-professor.component.html',
  styleUrl: './gerencia-professor.component.css'
})
export class GerenciaProfessorComponent implements OnInit {

  professores: Professor[] = [];
  dataSource = new MatTableDataSource<Professor>(this.professores);
  mensagemSnackbarAcerto: string = 'Professor excluído com sucesso.';
  mensagemSnackbarErro: string = 'Erro ao excluir professor.';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private service: ProfessorService,
    private router: Router,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.atualizaTabela();
  }

  atualizaTabela() {
    this.service.listar().subscribe(professores => {
      this.professores = professores;
      this.dataSource = new MatTableDataSource<Professor>(this.professores);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.dataSource.sortingDataAccessor = (item: Professor, property: string) => {
        switch (property) {
          case 'name': return item.name.toLowerCase();
          case 'educationLevel': return item.educationLevel.toLowerCase();
          case 'teacherCode': return item.teacherCode.toLowerCase();
          case 'coordination': return item.coordination.name.toLowerCase();
          default: return (item as any)[property];
        }
      };

      this.dataSource.filterPredicate = (data: Professor, filter: string) => {
        return data.name.toLowerCase().includes(filter) ||
                data.educationLevel.toLowerCase().includes(filter) ||
                data.coordination.name.toLowerCase().includes(filter) ||
                data.teacherCode.toLowerCase().includes(filter);
      };
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  editar(professor: { name: string }): void {
    const dialogRef = this.dialog.open(EdicaoProfessorComponent, {
      disableClose: true,
      backdropClass: 'backdrop',
      data: { professor }
    });

    dialogRef.afterClosed().subscribe(() => {
      this.atualizaTabela();
    });
  }

  excluir(professor: Professor): void {
    this.service.getRegistrosUsandoProfessor(professor._id).subscribe(registros => {
      if (registros.length > 0) {
        this.mostrarMensagemErro(registros);
      } else {
        const confirmacao = confirm('Tem certeza que deseja excluir este professor?');
        if (confirmacao) {
          this.service.remove(professor._id).subscribe(() => {
            this.professores = this.professores.filter(e => e._id !== professor._id);
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
      <span>Total de aulas do professor: <strong>${itensLista.length}</strong></span>
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
      this.snackBar.open('Professor excluído com sucesso', '', { duration: 5000, panelClass: ['successSnackbar'] });
      this.atualizaTabela();
    } else {
      this.snackBar.open(this.mensagemSnackbarAcerto, '', { duration: 5000, panelClass: ['successSnackbar'] });
    }
  }

  backPage() {
    this.router.navigate(['/cadastro-gerencia']);
  }

  cadastrar() {
    this.router.navigate(['/cadastro-gerencia/cadastro-professor']);
  }

}
