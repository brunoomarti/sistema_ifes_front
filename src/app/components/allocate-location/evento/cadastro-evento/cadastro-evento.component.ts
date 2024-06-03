import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { EventoService } from '../service/evento.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Evento } from '../../../../models/Evento';
import { ModalDialogComponent } from '../../../modal-dialog/modal-dialog.component';
import { ModalDialogOkComponent } from '../../../modal-dialog/modal-dialog-ok/modal-dialog-ok.component';

@Component({
  selector: 'app-cadastro-evento',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatTableModule
  ],
  templateUrl: './cadastro-evento.component.html',
  styleUrl: './cadastro-evento.component.css'
})
export class CadastroEventoComponent {

  form: FormGroup;
  mensagemSnackbarAcerto: string = 'Evento cadastrado com sucesso.';
  mensagemSnackbarErro: string = 'Erro ao cadastrar evento.';

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private service: EventoService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  )

  {
    this.form = this.formBuilder.group({
      _id: [0],
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(3)]],
      allocated: false
    });
  }

  ngOnInit(): void {

    const obj: Evento = this.route.snapshot.data['evento'];

    if (obj) {
      this.form.setValue({
        _id: obj._id,
        name: obj.name,
        description: obj.description,
        allocated: obj.allocated
      });
    }
  }

  onSubmit() {
    if (this.form.invalid) {
        const missingFields = [];
        if (this.form.get('name')?.hasError('required')) {
            missingFields.push('<li>Nome do evento</li>');
        }
        if (this.form.get('description')?.hasError('required')) {
            missingFields.push('<li>Descrição do evento</li>');
        }
        if (this.form.get('name')?.hasError('minlength')) {
            missingFields.push('<li>O nome deve ter pelo menos 3 caracteres</li>');
        }
        if (this.form.get('description')?.hasError('minlength')) {
            missingFields.push('<li>A descrição deve ter pelo menos 3 caracteres</li>');
        }
        const dialogDataForm = {
            title: 'Erro ao Cadastrar',
            message: `É necessário que os seguintes campos sejam preenchidos: ${missingFields.join('')}`,
        };
        this.openOkDialog(dialogDataForm);
    } else {
      this.save();
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
          title: 'Evento Cadastrado',
          message: `O evento ${result.name} foi cadastrado.`,
          buttons: {
            cadastrarNovo: 'Cadastrar Novo Evento',
            irParaGerencia: 'Ver Eventos Cadastrados'
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
      this.router.navigate(['/alocar-local']);
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
        this.form.get('applicant')?.setValue('');
        this.form.get('description')?.setValue('');
        this.form.get('allocated')?.setValue(false);
      } else {
        this.router.navigate(['/alocar-local/gerencia-evento']);
      }
    });
  }
}
