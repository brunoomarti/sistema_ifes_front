import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-allocate-location',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatTableModule,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './allocate-location.component.html',
  styleUrl: './allocate-location.component.css'
})
export class AllocateLocationComponent implements OnInit {

  alocacoes: any[] = [];
  dataSource: any;
  mensagemSnackbarAcerto: string = 'Alocação excluída com sucesso.';
  mensagemSnackbarErro: string = 'Erro ao excluir alocação.';

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    // private service: HorarioService,
    private router: Router,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    // this.atualizaTabela();
  }

  // atualizaTabela() {
  //   this.service.listar().subscribe(horarios => {
  //     this.horarios = horarios;
  //     this.dataSource = new MatTableDataSource<Horario>(this.horarios);
  //     this.dataSource.paginator = this.paginator;
  //   });
  // }

}
