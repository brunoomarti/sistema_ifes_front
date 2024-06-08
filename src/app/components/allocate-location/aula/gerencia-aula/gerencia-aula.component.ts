import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { AulaService } from '../service/aula.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Aula } from '../../../../models/Aula';
import { EdicaoAulaComponent } from '../edicao-aula/edicao-aula.component';
import { AlocaAulaComponent } from '../aloca-aula/aloca-aula.component';
import { AlunosMatriculadosComponent } from '../alunos-matriculados/alunos-matriculados.component';
import { AllocateService } from '../../allocate-main/service/allocate.service';
import { Alocar } from '../../../../models/Alocar';

@Component({
  selector: 'app-gerencia-aula',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatIcon,
    MatPaginator
  ],
  templateUrl: './gerencia-aula.component.html',
  styleUrl: './gerencia-aula.component.css'
})
export class GerenciaAulaComponent implements OnInit {

  aulas: any[] = [];
  dataSource: any;
  mensagemSnackbarAcerto: string = 'Disciplina excluída com sucesso.';
  mensagemSnackbarErro: string = 'Erro ao excluir disciplina.';
  hoverText: string = 'Não alocado';
  aulasAlocadasPorAula: Map<number, number> = new Map<number, number>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private service: AulaService,
    private router: Router,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    private allocateService: AllocateService
  ) { }

  ngOnInit(): void {
    this.atualizaTabela();
  }

  calcularAulasAlocadas(alocacoes: Alocar[]): Map<number, number> {
    const aulasMap = new Map<number, number>();

    alocacoes.forEach(alocacao => {
      const aulaId = alocacao.lesson._id;
      const selectedTimesCount = alocacao.selectedTimes.length;

      if (aulasMap.has(aulaId)) {
        aulasMap.set(aulaId, aulasMap.get(aulaId)! + selectedTimesCount);
      } else {
        aulasMap.set(aulaId, selectedTimesCount);
      }
    });

    return aulasMap;
  }

  atualizaTabela() {
    this.allocateService.listar().subscribe(alocacoes => {
      this.aulasAlocadasPorAula = this.calcularAulasAlocadas(alocacoes);
    });

    this.aulas.forEach(aula => {
      aula.limiteMaximoAtingido = this.isLimiteMaximoAtingido(aula);
    });

    this.service.listar().subscribe(aulas => {
      this.aulas = aulas;
      this.dataSource = new MatTableDataSource<Aula>(this.aulas);
      this.dataSource.paginator = this.paginator;
    });
  }

  isLimiteMaximoAtingido(aula: Aula): boolean {
    const aulaId = aula._id;
    const aulasAlocadas = this.aulasAlocadasPorAula.get(aulaId) || 0;
    return aulasAlocadas >= aula.weeklyQuantity;
  }

  editar(aula: { name: string }): void {
    const dialogRef = this.dialog.open(EdicaoAulaComponent, {
      disableClose: true,
      backdropClass: 'backdrop',
      data: { aula }
    });

    dialogRef.afterClosed().subscribe(() => {
      this.atualizaTabela();
    });
  }

  excluir(aula: Aula): void {
    const confirmacao = confirm(`Você está prestes a excluir uma aula. Com isso, todas as suas alocações também serão excluídas. Tem certeza que deseja continuar?`);
    if (confirmacao) {
      this.service.remove(aula._id).subscribe(() => {
        this.aulas = this.aulas.filter(e => e._id !== aula._id);
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
      this.snackBar.open('Aula excluída com sucesso', '', { duration: 5000, panelClass: ['successSnackbar'] });
      this.atualizaTabela();
    } else {
      this.snackBar.open(this.mensagemSnackbarAcerto, '', { duration: 5000, panelClass: ['successSnackbar'] });
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

  changeText(text: string, isHovering: boolean) {
    if (isHovering) {
      this.hoverText = text === 'alocar' ? 'Alocar agora' : this.hoverText;
    } else {
      this.hoverText = text === 'alocar' ? 'Não alocado' : this.hoverText;
    }
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

  isAulaMaxAlocada(aula: Aula): boolean {
    return aula.allocated || aula.students.length >= aula.weeklyQuantity;
  }

}
