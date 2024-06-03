import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { EventoService } from '../service/evento.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReloadService } from '../../../../shared-services/reload.service';
import { Evento } from '../../../../models/Evento';
import { ModalDialogOkComponent } from '../../../modal-dialog/modal-dialog-ok/modal-dialog-ok.component';

@Component({
  selector: 'app-edicao-evento',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatIcon
  ],
  templateUrl: './edicao-evento.component.html',
  styleUrl: './edicao-evento.component.css'
})
export class EdicaoEventoComponent implements OnInit {

  form: FormGroup;
  mensagemSnackbarAcerto: string = 'Evento editado com sucesso.';
  mensagemSnackbarErro: string = 'Erro ao editar evento.';

  constructor(
    public dialogRef: MatDialogRef<EdicaoEventoComponent>,
    private formBuilder: FormBuilder,
    private service: EventoService,
    private snackBar: MatSnackBar,
    private reloadService: ReloadService,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
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
    const obj: Evento = this.data.evento;
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
      backdropClass: 'backdropTwo'
    });
  }

  save() {
    this.service.save(this.form.value).subscribe(result => this.onSucess(), error => this.onFailed());
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSucess() {
    this.snackBar.open(this.mensagemSnackbarAcerto, '', { duration: 5000, panelClass: ['successSnackbar'] });
    this.dialogRef.close();
    this.reloadService.triggerReload();
  }

  onFailed() {
    this.snackBar.open(this.mensagemSnackbarErro, '', { duration: 5000, panelClass: ['errorSnackbar'] });
    this.dialogRef.close();
  }

}
