import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { AllocateService } from '../service/allocate.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReloadService } from '../../../../shared-services/reload.service';
import { Alocar } from '../../../../models/Alocar';
import { TurmaService } from '../../../cadastro-gerencia/turma/service/turma.service';
import { LocalService } from '../../../cadastro-gerencia/local/service/local.service';
import { Turma } from '../../../../models/Turma';
import { Local } from '../../../../models/Local';
import { Horario } from '../../../../models/Horario';
import { HorarioService } from '../../../cadastro-gerencia/horario/service/horario.service';
import { HistoryService } from '../historyService/history.service';

@Component({
  selector: 'app-edicao-alocacao-aula',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatIcon
  ],
  templateUrl: './edicao-alocacao-aula.component.html',
  styleUrl: './edicao-alocacao-aula.component.css'
})
export class EdicaoAlocacaoAulaComponent implements OnInit {

  form: FormGroup;
  formHistory: FormGroup;
  mensagemSnackbarAcerto: string = 'Alocação de aula editada com sucesso.';
  mensagemSnackbarErro: string = 'Erro ao editar alocação de aula.';
  turmas: Turma[] = [];
  locais: Local[] = [];
  horarios: Horario[] = [];
  selectedTimes: Horario[] = [];
  indexTimes: number[] = [];

  constructor(
    public dialogRef: MatDialogRef<EdicaoAlocacaoAulaComponent>,
    private formBuilder: FormBuilder,
    private service: AllocateService,
    private turmaService: TurmaService,
    private localService: LocalService,
    private horarioService: HorarioService,
    private historyService: HistoryService,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: Alocar,
  )

  {
    this.form = this.formBuilder.group({
      _id: [0],
      lesson: null,
      classe: new FormControl(''),
      startDate: null,
      endDate: null,
      selectedTimes:[],
      location: null,
      semester: null,
      type: 'Aula',
      weekDay: null,
      active: true
    });

    this.formHistory = this.formBuilder.group({
      _id: 0,
      lesson: null,
      classe: new FormControl(''),
      startDate: null,
      endDate: null,
      selectedTimes:[],
      location: null,
      semester: null,
      type: 'Aula',
      weekDay: null,
      alocacao: null,
      date: null,
      authorName: 'Igor',
      changeType: null,
    });
  }

  ngOnInit(): void {
    this.turmaService.listar().subscribe(turmas => {
      this.turmas = turmas;
    });

    this.localService.getLocaisAtivos().subscribe(locais => {
      this.locais = locais;
    });

    this.listarHorarios();

    const obj: Alocar = this.data;
    if (obj) {
      this.form.setValue({
        _id: obj.alocacao._id,
        lesson: obj.alocacao.lesson,
        classe: obj.alocacao.classe,
        startDate: obj.alocacao.startDate,
        endDate: obj.alocacao.endDate,
        selectedTimes: obj.alocacao.selectedTimes,
        semester: obj.alocacao.lesson.semester,
        location: obj.alocacao.location,
        type: 'Aula',
        weekDay: obj.alocacao.weekDay,
        active: true
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
      lesson: obj.alocacao.lesson,
      classe: obj.alocacao.classe,
      startDate: obj.alocacao.startDate,
      endDate: obj.alocacao.endDate,
      selectedTimes: JSON.stringify(selectedTimesAsString),
      semester: obj.alocacao.lesson.semester,
      location: obj.alocacao.location,
      type: 'Aula',
      weekDay: obj.alocacao.weekDay,
      alocacao: obj.alocacao,
      date: new Date(),
      authorName: 'Igor',
      changeType: 'Edição',
    });

    console.log(this.formHistory.value);

    this.historyService.save(this.formHistory.value).subscribe(result => this.onSucess(), error => this.onFailed());

    const selectedClasse = this.turmas.find(findObj => findObj._id == this.form.value.classe);
    const selectedLocation = this.locais.find(findObj => findObj._id == this.form.value.location);

    this.indexTimes.forEach(hr => {
      const selectedHour = this.horarios.find(obj => obj._id == hr);
      if (selectedHour){
        this.selectedTimes.push(selectedHour);
      }
    })

    if (selectedClasse && selectedLocation ) {
      this.form.patchValue({ classe: selectedClasse });
      this.form.patchValue({ location: selectedLocation });
      this.form.patchValue({ selectedTimes: this.selectedTimes })
    }

    console.log(this.form.value);

    this.service.save(this.form.value).subscribe(result => this.onSucess(), error => this.onFailed());
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSucess() {
    this.snackBar.open(this.mensagemSnackbarAcerto, '', { duration: 5000, panelClass: ['successSnackbar'] });
    this.dialogRef.close();
    // this.reloadService.triggerReload();
  }

  onFailed() {
    this.snackBar.open(this.mensagemSnackbarErro, '', { duration: 5000, panelClass: ['errorSnackbar'] });
    this.dialogRef.close();
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

  listarHorarios(): void {
    this.horarioService.listar().subscribe(horarios => {
      this.horarios = horarios.map(horario => ({
        _id: horario._id,
        startTime: horario.startTime,
        endTime: horario.endTime
      }));
    });
  }

}
