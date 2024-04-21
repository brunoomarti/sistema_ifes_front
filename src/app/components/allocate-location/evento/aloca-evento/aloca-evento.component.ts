import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { Local } from '../../../../models/Local';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LocalService } from '../../../cadastro-gerencia/local/service/local.service';
import { AllocateService } from '../../allocate-main/service/allocate.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReloadService } from '../../../../shared-services/reload.service';
import { Evento } from '../../../../models/Evento';
import { AlocaHorario } from '../../../../models/AlocaHorario';

@Component({
  selector: 'app-aloca-evento',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatIcon
  ],
  templateUrl: './aloca-evento.component.html',
  styleUrl: './aloca-evento.component.css'
})
export class AlocaEventoComponent implements OnInit {

  form: FormGroup;
  mensagemSnackbarAcerto: string = 'Evento alocado com sucesso.';
  mensagemSnackbarErro: string = 'Erro ao alocar evento.';
  locais: Local[] = [];

  constructor(
    public dialogRef: MatDialogRef<AlocaEventoComponent>,
    private formBuilder: FormBuilder,
    private localService: LocalService,
    private allocateService: AllocateService,
    private snackBar: MatSnackBar,
    private reloadService: ReloadService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  )

  {
    this.form = this.formBuilder.group({
      _id: [0],
      event: null,
      startDate: null,
      endDate: null,
      startTime: null,
      endTime: null,
      selectedTimes: new FormControl([]),
      location: null,
      type: 'Evento'
    });
  }

  ngOnInit(): void {
    this.localService.listar().subscribe(locais => {
      this.locais = locais;
    });

    const obj: Evento = this.data.evento;
    if (obj) {
      this.form.setValue({
        _id: 0,
        event: obj,
        startDate: null,
        endDate: null,
        startTime: null,
        endTime: null,
        selectedTimes: null,
        location: null,
        type: 'Evento'
      });
    }
  }

  onSubmit() {
    const selectedLocation = this.locais.find(obj => obj._id == this.form.value.location);

    const selectedTimes: AlocaHorario = {
      _id: 0,
      schedule: {
        _id: 0,
        startTime: this.form.value.startTime,
        endTime: this.form.value.endTime
      }
    };

    if (selectedLocation && selectedTimes && this.form.value.startDate) {
      this.form.patchValue({ classe: selectedLocation });
      this.form.patchValue({ selectedTimes: selectedTimes });
      this.form.patchValue({ endDate: this.form.value.startDate });
    }

    this.allocateService.save(this.form.value).subscribe(result => this.onSucess(), error => this.onFailed());
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
