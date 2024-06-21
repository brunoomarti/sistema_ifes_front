import { CommonModule, Time } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { Local } from '../../../../models/Local';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { LocalService } from '../../../cadastro-gerencia/local/service/local.service';
import { AllocateService } from '../../allocate-main/service/allocate.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReloadService } from '../../../../shared-services/reload.service';
import { Evento } from '../../../../models/Evento';
import { Horario } from '../../../../models/Horario';
import { HorarioService } from '../../../cadastro-gerencia/horario/service/horario.service';
import { EventoService } from '../service/evento.service';
import { ModalDialogOkComponent } from '../../../modal-dialog/modal-dialog-ok/modal-dialog-ok.component';
import { Alocar } from '../../../../models/Alocar';

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
  alocacoes: Alocar[] = [];

  constructor(
    public dialogRef: MatDialogRef<AlocaEventoComponent>,
    private formBuilder: FormBuilder,
    private localService: LocalService,
    private horarioService: HorarioService,
    private allocateService: AllocateService,
    private eventoService: EventoService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
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

    this.allocateService.listar().subscribe(alocacoes => {
      this.alocacoes = alocacoes;
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
    if (this.form.valid){
      let erros: string[] = [];
      
      const selectedLocation = this.locais.find(obj => obj._id == this.form.value.location);

      erros = this.verificarDataEHora();

      if (selectedLocation && this.form.value.startDate) {
        this.form.patchValue({ location: selectedLocation });
        this.form.patchValue({ endDate: this.form.value.startDate });
      }

      this.data.evento.allocated = true;

      if (erros.length > 0) {
        const dialogData = {
          title: 'Erro ao Alocar Evento',
          message: erros.join('<br>')
        };
        this.dialog.open(ModalDialogOkComponent, {
          data: dialogData,
          backdropClass: 'backdropTwo'
        });
      } else {
        this.eventoService.save(this.data.evento).subscribe(result => this.onSucess(), error => this.onFailed());
        this.allocateService.save(this.form.value).subscribe(result => this.onSucess(), error => this.onFailed());
      }
    } else {
      const missingFields = [];


      if (this.form.get('location')?.hasError('required')) {
        missingFields.push('<li>Selecione um Local</li>');
      }

      if (this.form.get('applicant')?.hasError('required')) {
        missingFields.push('<li>Informe o requerente</li>');
      }

      if (this.form.get('startDate')?.hasError('required')) {
        missingFields.push('<li>Selecione uma data</li>');
      }

      if (this.form.get('startTime')?.hasError('required')) {
        missingFields.push('<li>Selecione uma Hora Inicio</li>');
      }

      if (this.form.get('endTime')?.hasError('required')) {
        missingFields.push('<li>Selecione uma Hora de fim</li>');
      }
      
      const dialogDataForm = {
        title: 'Erro ao Alocar',
        message: `É necessário que os seguintes campos sejam preenchidos: ${missingFields.join('')}`,
      };

      this.dialog.open(ModalDialogOkComponent, {
        data: dialogDataForm,
        backdropClass: 'backdropTwo'
      });
    }
  }


  verificarDataEHora(){
    const erros: string[] = [];

    const selectedLocation = this.locais.find(obj => obj._id == this.form.value.location);

    this.alocacoes.forEach((a) => {
    if (selectedLocation?._id == a.location._id) {
      if (this.form.value.startDate == a.startDate) {
        if (this.form.value.startTime == a.startTime) {
          if (this.form.value.endTime == a.endTime) {
            erros.push('<li>Já existe outra alocação para o mesmo período de tempo, data e local escolhidos.<li>');
            return;
          }
        }
      }
    }
    })
    return erros;
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
