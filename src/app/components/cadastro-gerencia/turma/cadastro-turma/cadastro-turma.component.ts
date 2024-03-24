import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { TurmaService } from '../service/turma.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Turma } from '../../../../models/Turma';
import { MatDialog } from '@angular/material/dialog';
import { ModalDialogComponent } from '../../../modal-dialog/modal-dialog.component';

@Component({
  selector: 'app-cadastro-turma',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatTableModule
  ],
  templateUrl: './cadastro-turma.component.html',
  styleUrl: './cadastro-turma.component.css'
})
export class CadastroTurmaComponent implements OnInit {

  form: FormGroup;
  mensagemSnackbarAcerto: string = 'Turma cadastrada com sucesso.';
  mensagemSnackbarErro: string = 'Erro ao cadastrar turma.';

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private service: TurmaService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  )

  {
    this.form = this.formBuilder.group({
      id: [0],
      name: ''
    });
  }

  ngOnInit(): void {
    const obj: Turma = this.route.snapshot.data['turma'];
    if (obj) {
      this.form.setValue({
        id: obj._id,
        name: obj.name
      });
    }
  }

  onSubmit() {
    this.service.save(this.form.value).subscribe(
      result => {
        const dialogData = {
          title: 'Turma Cadastrada',
          message: `A turma ${result.name} foi cadastrada.`,
          buttons: {
            cadastrarNovo: 'Cadastrar Nova Turma',
            irParaGerencia: 'Ver Turmas Cadastradas'
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
        this.router.navigate(['/cadastro-gerencia/gerencia-turma']);
      }
    });
  }
}
