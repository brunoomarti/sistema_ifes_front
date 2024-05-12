import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { CursoService } from '../service/curso.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ModalDialogComponent } from '../../../modal-dialog/modal-dialog.component';

@Component({
  selector: 'app-cadastro-curso',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatTableModule
  ],
  templateUrl: './cadastro-curso.component.html',
  styleUrl: './cadastro-curso.component.css'
})
export class CadastroCursoComponent implements OnInit {

  form: FormGroup;
  mensagemSnackbarAcerto: string = 'Curso cadastrado com sucesso.';
  mensagemSnackbarErro: string = 'Erro ao cadastrar curso.';

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private service: CursoService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  )

  {
    this.form = this.formBuilder.group({
      id: [0],
      name: ['']
    });
  }

  ngOnInit(): void {
    this.form.setValue({
      id: null,
      name: null
    });
  }

  onSubmit() {
    this.service.save(this.form.value).subscribe(
      result => {
        const dialogData = {
          title: 'Curso Cadastrado',
          message: `O curso ${result.name} foi cadastrado.`,
          buttons: {
            cadastrarNovo: 'Cadastrar Novo Curso',
            irParaGerencia: 'Ver Cursos Cadastrados'
          }
        };
        this.openDialog(dialogData);
      },
      error => {
        this.onFailed();
      }
    );
  }

  onCancel() {
    if (confirm('Tem certeza que deseja cancelar?')) {
      this.router.navigate(['/cadastro-gerencia']);
    }
  }

  onFailed() {
    this.snackBar.open(this.mensagemSnackbarErro, '', { duration: 5000, panelClass: ['errorSnackbar'] });
  }

  onSucess() {
    this.snackBar.open(this.mensagemSnackbarAcerto, '', { duration: 5000, panelClass: ['successSnackbar'] });
  }

  openDialog(data: any): void {
    const dialogRef = this.dialog.open(ModalDialogComponent, {
      data: data,
      disableClose: true,
      backdropClass: 'backdrop'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'cadastrarNovo') {
        this.form.get('name')?.setValue('');
      } else {
        this.router.navigate(['/cadastro-gerencia/gerencia-curso']);
      }
    });
  }

}
