import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { AulaService } from '../service/aula.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Aula } from '../../../../models/Aula';
import { EdicaoAulaComponent } from '../edicao-aula/edicao-aula.component';
import { AlocaAulaComponent } from '../aloca-aula/aloca-aula.component';
import { AlunosMatriculadosComponent } from '../alunos-matriculados/alunos-matriculados.component';
import { AllocateService } from '../../allocate-main/service/allocate.service';
import { Alocar } from '../../../../models/Alocar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSort, MatSortModule } from '@angular/material/sort';

@Component({
  selector: 'app-gerencia-aula',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatPaginatorModule,
    MatSnackBarModule,
    MatDialogModule,
    MatCheckboxModule,
    MatInputModule,
    MatSortModule
  ],
  templateUrl: './gerencia-aula.component.html',
  styleUrls: ['./gerencia-aula.component.css']
})
export class GerenciaAulaComponent implements OnInit {
  aulas: Aula[] = [];
  dataSource = new MatTableDataSource<Aula>(this.aulas);
  userRole: string | null = '';

  displayedColumns: string[] = [];

  selection = new SelectionModel<Aula>(true, []);
  
  aulasAlocadasPorAula: Map<number, number> = new Map<number, number>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private service: AulaService,
    private router: Router,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    private allocateService: AllocateService
  ) {}

  ngOnInit(): void {
    
    if (typeof localStorage !== 'undefined') {
      this.userRole = localStorage.getItem('role');
    }

    if (this.userRole === 'TEACHER'){
      this.displayedColumns  = ['select', 'discipline', 'teacher', 'semester', 'weeklyQuantity', 'allocatedLessons', 'allocated', 'students'];
    } else {
      this.displayedColumns  = ['select', 'discipline', 'teacher', 'semester', 'weeklyQuantity', 'allocatedLessons', 'allocated', 'students', 'actions'];
    }

    this.atualizaTabela();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  calcularAulasAlocadas(alocacoes: Alocar[]): Map<number, number> {
    const aulasMap = new Map<number, number>();

    alocacoes.forEach(alocacao => {
      if (!alocacao.applicant) {
        const aulaId = alocacao.lesson._id;
        const selectedTimesCount = alocacao.selectedTimes.length;

        if (aulasMap.has(aulaId)) {
          aulasMap.set(aulaId, aulasMap.get(aulaId)! + selectedTimesCount);
        } else {
          aulasMap.set(aulaId, selectedTimesCount);
        }
      }
    });

    return aulasMap;
  }

  atualizaTabela() {
    this.service.listar().subscribe(aulas => {
      this.aulas = aulas;
      this.dataSource.data = this.aulas;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.dataSource.sortingDataAccessor = (item: Aula, property: string) => {
        switch (property) {
          case 'discipline': return item.discipline.name.toLowerCase();
          case 'teacher': return item.teacher.name.toLowerCase();
          case 'semester': return item.semester.semester.toLowerCase()
          default: return (item as any)[property];
        }
      };

      this.dataSource.filterPredicate = (data: Aula, filter: string) => {
        return data.discipline.name.toLowerCase().includes(filter) ||
                data.teacher.name.toLowerCase().includes(filter) ||
                data.discipline.name.toLowerCase().includes(filter);
      };
    });

    this.allocateService.listar().subscribe(alocacoes => {
      this.aulasAlocadasPorAula = this.calcularAulasAlocadas(alocacoes);
    });

  }

  isLimiteMaximoAtingido(aula: Aula): boolean {
    const aulaId = aula._id;
    const aulasAlocadas = this.aulasAlocadasPorAula.get(aulaId) || 0;
    return aulasAlocadas >= aula.weeklyQuantity;
  }

  editar(aula: Aula): void {
    const dialogRef = this.dialog.open(EdicaoAulaComponent, {
      disableClose: true,
      backdropClass: 'backdrop',
      data: { aula }
    });

    dialogRef.afterClosed().subscribe(() => {
      this.atualizaTabela();
    });
  }

  excluirSelecionados(): void {
    const confirmacao = confirm(`Você está prestes a excluir as aulas selecionadas. Com isso, todas as suas alocações também serão excluídas. Tem certeza que deseja continuar?`);
    if (confirmacao) {
      const ids = this.selection.selected.map(aula => aula._id);
      this.service.remove(ids).subscribe(() => {
        this.aulas = this.aulas.filter(aula => !ids.includes(aula._id));
        this.onSucess(true);
        this.selection.clear();
      }, error => {
        console.error('Erro ao excluir aulas: ', error);
        this.onFailed();
      });
    }
  }

  onFailed() {
    this.snackBar.open('Erro ao excluir disciplina.', '', { duration: 5000, panelClass: ['errorSnackbar'] });
  }

  onSucess(excluir: boolean = false) {
    if (excluir) {
      this.snackBar.open('Aula excluída com sucesso', '', { duration: 5000, panelClass: ['successSnackbar'] });
      this.atualizaTabela();
    } else {
      this.snackBar.open('Operação realizada com sucesso', '', { duration: 5000, panelClass: ['successSnackbar'] });
    }
  }

  backPage() {
    this.router.navigate(['/alocar-local']);
  }

  cadastrar() {
    this.router.navigate(['/alocar-local/cadastro-aula']);
  }

  alocarAula(aula: Aula): void {
    const dialogRef = this.dialog.open(AlocaAulaComponent, {
      disableClose: true,
      backdropClass: 'backdrop',
      data: { aula }
    });

    dialogRef.afterClosed().subscribe(() => {
      this.atualizaTabela();
    });
  }

  alunosAula(aula: Aula): void {
    const dialogRef = this.dialog.open(AlunosMatriculadosComponent, {
      disableClose: false,
      backdropClass: 'backdrop',
      data: { aula }
    });

    dialogRef.afterClosed().subscribe(() => {
      this.atualizaTabela();
    });
  }

  toggleSelection(aula: Aula) {
    this.selection.toggle(aula);
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ? this.selection.clear() : this.dataSource.data.forEach((row: Aula) => this.selection.select(row));
  }
}
