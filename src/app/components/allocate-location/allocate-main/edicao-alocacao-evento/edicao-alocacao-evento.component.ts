import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { AllocateService } from '../service/allocate.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReloadService } from '../../../../shared-services/reload.service';
import { Alocar } from '../../../../models/Alocar';
import { Evento } from '../../../../models/Evento';
import { Local } from '../../../../models/Local';
import { LocalService } from '../../../cadastro-gerencia/local/service/local.service';
import { HistoryService } from '../historyService/history.service';
import { Horario } from '../../../../models/Horario';

@Component({
  selector: 'app-edicao-alocacao-evento',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatIcon
  ],
  templateUrl: './edicao-alocacao-evento.component.html',
  styleUrl: './edicao-alocacao-evento.component.css'
})
export class EdicaoAlocacaoEventoComponent implements OnInit {

  form: FormGroup;
  formHistory: FormGroup;
  mensagemSnackbarAcerto: string = 'Alocação de evento editado com sucesso.';
  mensagemSnackbarErro: string = 'Erro ao editar alocação de evento.';
  locais: Local[] = [];
  selectedTimes: Horario[] = [];
  indexTimes: number[] = [];
  
  constructor(
    public dialogRef: MatDialogRef<EdicaoAlocacaoEventoComponent>,
    private formBuilder: FormBuilder,
    private historyService: HistoryService,
    private service: AllocateService,
    private localService: LocalService,
    private snackBar: MatSnackBar,
    private reloadService: ReloadService,
    @Inject(MAT_DIALOG_DATA) public data: Alocar,
  )

  {
    this.form = this.formBuilder.group({
      _id: 0,
      startDate: null,
      startTime: null,
      endTime: null, 
      selectedTimes: [],
      location: null,
      type: 'Evento'
    });

    this.formHistory = this.formBuilder.group({
      _id: 0,
      startDate: null,
      startTime: null,
      endTime: null,
      selectedTimes:[],
      location: null,
      type: 'Evento',
      alocacao: null,
      date: null,
      authorName: 'Igor',
      changeType: null,
    });
  }

  ngOnInit(): void {
    const obj: Alocar = this.data;
    console.log(this.data);

    this.localService.getLocaisAtivos().subscribe(locais => {
      this.locais = locais;
    }); 

    if (obj) {
      this.form.setValue({
        _id: obj.alocacao._id,
        startTime: obj.alocacao.startTime,
        endTime: obj.alocacao.endTime,
        startDate: obj.alocacao.startDate,
        selectedTimes: obj.alocacao.selectedTimes,
        location: obj.alocacao.location,
        type: "Evento"
      });
    }
  }

  onSubmit() {
    const obj: Alocar = this.data;

    const selectedTimesAsString = obj.alocacao.selectedTimes.map(time => ({
      _id: time._id,
      startTime: time.startTime.toString(),
      endTime: time.endTime.toString()
    }));

    this.formHistory.setValue({
      _id: 0,
      startDate: obj.alocacao.startDate,
      startTime: obj.alocacao.startTime,
      endTime: obj.alocacao.endTime,
      selectedTimes: JSON.stringify(selectedTimesAsString),
      location: obj.alocacao.location,
      type: 'Evento',
      alocacao: obj.alocacao._id,
      date: new Date(),
      authorName: 'Igor',
      changeType: 'Edição',
    });

    console.log(this.formHistory.value);

    this.historyService.save(this.formHistory.value).subscribe(result => this.onSucess(), error => this.onFailed());
 
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
