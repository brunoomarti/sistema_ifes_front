import { Turma } from './../../../../models/Turma';
import { CommonModule, DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { TurmaService } from '../../../cadastro-gerencia/turma/service/turma.service';
import { AllocateService } from '../../allocate-main/service/allocate.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReloadService } from '../../../../shared-services/reload.service';
import { Aula } from '../../../../models/Aula';
import { Local } from '../../../../models/Local';
import { LocalService } from '../../../cadastro-gerencia/local/service/local.service';
import { HorarioService } from '../../../cadastro-gerencia/horario/service/horario.service';
import { Horario } from '../../../../models/Horario';

@Component({
  selector: 'app-aloca-aula',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatIcon
  ],
  templateUrl: './aloca-aula.component.html',
  styleUrl: './aloca-aula.component.css',
  providers: [DatePipe]
})
export class AlocaAulaComponent implements OnInit {

  form: FormGroup;
  mensagemSnackbarAcerto: string = 'Aula alocada com sucesso.';
  mensagemSnackbarErro: string = 'Erro ao alocar aula.';
  turmas: Turma[] = [];
  locais: Local[] = [];
  horarios: Horario[] = [];
  selectedTimes: Horario[] = [];

  constructor(
    public dialogRef: MatDialogRef<AlocaAulaComponent>,
    private formBuilder: FormBuilder,
    private turmaService: TurmaService,
    private localService: LocalService,
    private horarioService: HorarioService,
    private allocateService: AllocateService,
    private snackBar: MatSnackBar,
    private reloadService: ReloadService,
    private datePipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) public data: any,
  )

  {
    this.form = this.formBuilder.group({
      _id: [0],
      lesson: null,
      classe: new FormControl(''),
      startDate: null,
      endDate: null,
      selectedTimes: this.formBuilder.array([]),
      location: null,
      type: 'Aula'
    });
  }

  get selectedTimesFormArray(): FormArray {
    return this.form.get('selectedTimes') as FormArray;
  }

  ngOnInit(): void {
    this.turmaService.listar().subscribe(turmas => {
      this.turmas = turmas;
    });

    this.localService.listar().subscribe(locais => {
      this.locais = locais;
    });

    this.listarHorarios();

    const obj: Aula = this.data.aula;
    if (obj) {
      this.form.setValue({
        _id: 0,
        lesson: obj,
        classe: null,
        startDate: null,
        endDate: null,
        selectedTimes: null,
        location: null,
        type: 'Aula'
      });
    }
  }

  onSubmit() {


    const selectedClasse = this.turmas.find(obj => obj._id == this.form.value.classe);

    const selectedLocation = this.locais.find(obj => obj._id == this.form.value.location);

    startDate: this.form.value.startDate
    endDate: this.form.value.endDate

    if (selectedClasse && selectedLocation) {
      this.form.patchValue({ classe: selectedClasse });
      this.form.patchValue({ location: selectedLocation });
    }

    console.log('Form Value:', this.form.value);
    console.log('Selected Times:', this.selectedTimesFormArray.value);

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

  listarHorarios(): void {
    this.horarioService.listar().subscribe(horarios => {
      this.horarios = horarios.map(horario => ({
        _id: horario._id,
        startTime: horario.startTime,
        endTime: horario.endTime
      }));
    });
  }

  onCheckboxChange(event: Event, horario: Horario): void {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      this.selectedTimesFormArray.push(new FormControl(horario));
    } else {
      const index = this.selectedTimesFormArray.controls.findIndex(ctrl => ctrl.value._id === horario._id);
      if (index !== -1) {
        this.selectedTimesFormArray.removeAt(index);
      }
    }
  }

  isSelected(horarioId: number): boolean {
    return this.selectedTimesFormArray.controls.some(ctrl => ctrl.value._id === horarioId);
  }

}
