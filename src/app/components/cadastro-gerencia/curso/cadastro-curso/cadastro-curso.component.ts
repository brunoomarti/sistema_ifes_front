import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { CursoService } from '../service/curso.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ModalDialogComponent } from '../../../modal-dialog/modal-dialog.component';
import { Curso } from '../../../../models/Curso';
import { ModalDialogOkComponent } from '../../../modal-dialog/modal-dialog-ok/modal-dialog-ok.component';

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

  cursos: Curso[] = [];
  form: FormGroup;
  mensagemSnackbarAcerto: string = 'Curso cadastrado com sucesso.';
  mensagemSnackbarErro: string = 'Erro ao cadastrar curso.';

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private service: CursoService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  )

  {
    this.form = this.formBuilder.group({
      id: [0],
      name: ['', Validators.required],
      identityNumber: ['0000', Validators.required]
    });
  }

  ngOnInit(): void {
    this.form.setValue({
      id: null,
      name: null
    });
  }

  onSubmit() {
    if (this.form.valid) {
      let name = this.form.get('name')?.value;
      let identityNumber = this.form.get('identityNumber')?.value;
      name = name.toLowerCase();

      this.service.listar().subscribe(cursos => {
          this.cursos = cursos;

          const errors = [];

          const duplicateName = this.cursos.some(curso => curso.name.toLowerCase() === name);
          const duplicateIdentity = this.cursos.some(curso => curso.identityNumber === identityNumber);

          if (duplicateName) {
              errors.push('Já existe um registro com o mesmo nome.');
          }
          if (duplicateIdentity) {
              errors.push('Já existe um registro com esse número de identificação.');
          }

          if (errors.length > 0) {
              const dialogData = {
                  title: 'Erro ao Cadastrar',
                  message: errors.join('\n')
              };
              this.dialog.open(ModalDialogOkComponent, {
                  data: dialogData,
                  backdropClass: 'backdrop'
              });
          } else {
              this.save();
          }
      });
  } else {
      const missingFields = [];
      if (this.form.get('name')?.hasError('required')) {
        missingFields.push('<li>Nome</li>');
      }
      if (this.form.get('identityNumber')?.hasError('required')) {
        missingFields.push('<li>Número de identificação (4 caracteres)</li>');
      } else if (this.form.get('identityNumber')?.value.length != 4) {
        missingFields.push('<li>Número de identificação (4 caracteres)</li>');
      }
      const dialogDataForm = {
        title: 'Erro ao Cadastrar',
        message: `É necessário que os seguintes campos sejam preenchidos: ${missingFields.join('')}`,
      };

      this.dialog.open(ModalDialogOkComponent, {
        data: dialogDataForm,
        backdropClass: 'backdrop'
      });
    }
  }

  save() {
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
