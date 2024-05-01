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
import { Horario } from '../../../../models/Horario';
import { HorarioService } from '../../../cadastro-gerencia/horario/service/horario.service';
import { EventoService } from '../service/evento.service';

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
  horarios: Horario[] = [];
  selectedTimes: Horario[] = [];
  indexTimes: number[] = [];

  constructor(
    public dialogRef: MatDialogRef<AlocaEventoComponent>,
    private formBuilder: FormBuilder,
    private localService: LocalService,
    private horarioService: HorarioService,
    private allocateService: AllocateService,
    private eventoService: EventoService,
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
      applicant: null,
      selectedTimes: [],
      location: null,
      type: 'Evento',
      active: true
    });
  }

  ngOnInit(): void {
    this.localService.getLocaisAtivos().subscribe(locais => {
      this.locais = locais;
    });

    this.listarHorarios();

    const obj: Evento = this.data.evento;
    if (obj) {
      this.form.setValue({
        _id: 0,
        event: obj,
        startDate: null,
        endDate: null,
        startTime: null,
        endTime: null,
        applicant: null,
        selectedTimes: [],
        location: null,
        type: 'Evento',
        active: true
      });
    }
  }

  onSubmit() {
    const selectedLocation = this.locais.find(obj => obj._id == this.form.value.location);

    if (selectedLocation && this.form.value.startDate) {
      this.form.patchValue({ location: selectedLocation });
      this.form.patchValue({ endDate: this.form.value.startDate });
    }

    this.data.evento.allocated = true;

    this.eventoService.save(this.data.evento).subscribe(result => this.onSucess(), error => this.onFailed());
    this.allocateService.save(this.form.value).subscribe(result => this.onSucess(), error => this.onFailed());
  }

  listarHorarios(): void {
    this.horarioService.listar().subscribe(horarios => {
      this.horarios = horarios.map(horario => ({
        _id: horario._id,
        startTime: horario.startTime,
        endTime: horario.endTime
      }));
    });
  }

  onCheckboxChange(event: any, horario: any) {
    if (event.target.checked) {
      this.indexTimes.push(horario._id);
    } else {
      const index = this.indexTimes.indexOf(horario._id);
      if (index !== -1) {
        this.indexTimes.splice(index, 1);
      }
    }
    console.log(this.indexTimes);
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
