import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CoordenadoriaService } from '../service/coordenadoria.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Coordenadoria } from '../../../../models/Coordenadoria';
import { EdicaoCoordenadoriaComponent } from '../edicao-coordenadoria/edicao-coordenadoria.component';
import { ModalDialogComponent } from '../../../modal-dialog/modal-dialog.component';
import { ModalDialogOkComponent } from '../../../modal-dialog/modal-dialog-ok/modal-dialog-ok.component';
import { ProfessorService } from '../../professor/service/professor.service';
import { CoordenadorService } from '../../coordenador/service/coordenador.service';
import { Professor } from '../../../../models/Professor';

@Component({
  selector: 'app-gerencia-coordenadoria',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatIcon,
    MatPaginator
  ],
  templateUrl: './gerencia-coordenadoria.component.html',
  styleUrl: './gerencia-coordenadoria.component.css'
})
export class GerenciaCoordenadoriaComponent implements OnInit {

  coordenadorias: any[] = [];
  professores: Professor[] = [];
  coordenadores: any[] = [];
  dataSource: any;
  mensagemSnackbarAcerto: string = 'Coordenadoria excluída com sucesso.';
  mensagemSnackbarErro: string = 'Erro ao excluir coordenadoria.';

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private service: CoordenadoriaService,
    private professorService: ProfessorService,
    private coordenadorService: CoordenadorService,
    private router: Router,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.atualizaTabela();
  }

  atualizaTabela() {
    this.service.listar().subscribe(coordenadorias => {
      this.coordenadorias = coordenadorias;
      this.dataSource = new MatTableDataSource<Coordenadoria>(this.coordenadorias);
      this.dataSource.paginator = this.paginator;
    });
  }

  editar(coordenadoria: { name: string }): void {
    const dialogRef = this.dialog.open(EdicaoCoordenadoriaComponent, {
      backdropClass: 'backdrop',
      data: { coordenadoria }
    });

    dialogRef.afterClosed().subscribe(() => {
      this.atualizaTabela();
    });
  }

  excluir(coordenadoria: Coordenadoria): void {
    this.service.getRegistrosUsandoCoordenadoria(coordenadoria._id).subscribe(registros => {
      if (registros.length > 0) {
        this.mostrarMensagemErro(registros);
      } else {
        const confirmacao = confirm('Tem certeza que deseja excluir esta coordenadoria?');
        if (confirmacao) {
          this.service.remove(coordenadoria._id).subscribe(() => {
            this.coordenadorias = this.coordenadorias.filter(e => e._id !== coordenadoria._id);
            this.onSucess(true);
          }, error => {
            this.onFailed();
          });
        }
      }
    });
  }


  mostrarMensagemErro(registros: any[]): void {
    registros.map((a) => { console.log(a.name)})

    const itensLista = registros.map(registro => {
      if (!registro.specialty) {
        return `Coordenador: ${registro.name}`;
      } else{
        return `Professor: ${registro.name} (${registro.teacherCode})`;
      }

    });

    const dialogDataForm = {
      title: 'Erro ao Excluir Coordenadoria',
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
      this.snackBar.open('Coordenadoria excluída com sucesso', '', { duration: 5000, panelClass: ['successSnackbar'] });
      this.atualizaTabela();
    } else {
      this.snackBar.open(this.mensagemSnackbarAcerto, '', { duration: 5000, panelClass: ['successSnackbar'] });
    }
  }

  backPage() {
    this.router.navigate(['/cadastro-gerencia']);
  }

  verDescricao(coordenadoria: Coordenadoria): void {
    const dialogData = {
      title: 'Descrição',
      message: `${coordenadoria.description}`,
      viewButton: false
    };
    this.openDialog(dialogData);
  }

  openDialog(data: any): void {
    const dialogRef = this.dialog.open(ModalDialogComponent, {
      data: data,
      disableClose: false,
      backdropClass: 'backdrop'
    });

    dialogRef.afterClosed().subscribe(result => {
      this.atualizaTabela();
    });
  }

  cadastrar() {
    this.router.navigate(['/cadastro-gerencia/cadastro-coordenadoria']);
  }

}
