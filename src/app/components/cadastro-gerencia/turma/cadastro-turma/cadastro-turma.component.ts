import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { TurmaService } from '../service/turma.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Turma } from '../../../../models/Turma';
import { MatDialog } from '@angular/material/dialog';
import { ModalDialogComponent } from '../../../modal-dialog/modal-dialog.component';
import { ModalDialogOkComponent } from '../../../modal-dialog/modal-dialog-ok/modal-dialog-ok.component';

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

  turmas: Turma[] = [];
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
      name: ['', Validators.required]
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

    this.form.get('name')?.valueChanges.subscribe(value => {
      const upperCaseValue = value.toUpperCase();
      if (value !== upperCaseValue) {
        this.form.get('name')?.setValue(upperCaseValue, { emitEvent: false });
      }
    });
  }

  onSubmit() {
    if (this.form.valid) {
        let name = this.form.get('name')?.value;
        name = name.toLowerCase();

        const errors: string[] = [];

        const regex = /^[mvn]\d{2}$/i;
        if (!regex.test(name)) {
            errors.push('A turma deve ser escrita como o exemplo a seguir: <strong>M01</strong><br><br>A primeira letra DEVE ser M, V ou N e os outros dois caracteres devem ser números.');
        }

        this.service.listar().subscribe(turmas => {
            this.turmas = turmas;

            const duplicateName = this.turmas.some(turma => turma.name.toLowerCase() === name);

            if (duplicateName) {
                errors.push('Já existe um registro com o mesmo nome.');
            }

            if (errors.length > 0) {
                const dialogData = {
                    title: 'Erro ao Cadastrar',
                    message: errors.join('<br>')
                };
                this.openOkDialog(dialogData);
            } else {
                this.save();
            }
        });
    } else {
        const missingFields = [];
        if (this.form.get('name')?.hasError('required')) {
            missingFields.push('<li>Nome</li>');
        }
        const dialogDataForm = {
            title: 'Erro ao Cadastrar',
            message: `É necessário que os seguintes campos sejam preenchidos: ${missingFields.join('')}`,
        };
        this.openOkDialog(dialogDataForm);
    }
}

  openOkDialog(data: any): void {
    this.dialog.open(ModalDialogOkComponent, {
      data: data,
      backdropClass: 'backdrop'
    });
  }

  save() {
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
