import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { EventoService } from '../service/evento.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReloadService } from '../../../../shared-services/reload.service';
import { Evento } from '../../../../models/Evento';

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
    @Inject(MAT_DIALOG_DATA) public data: any,
  )

  {
    this.form = this.formBuilder.group({
      _id: [0],
      name: '',
      description: '',
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
