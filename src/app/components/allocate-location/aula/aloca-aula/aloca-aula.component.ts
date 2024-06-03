import { Turma } from './../../../../models/Turma';
import { CommonModule, DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
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
import { Semestre } from '../../../../models/Semestre';
import { SemestreService } from '../../../cadastro-gerencia/semestre/service/semestre.service';
import { ModalDialogOkComponent } from '../../../modal-dialog/modal-dialog-ok/modal-dialog-ok.component';

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
  indexTimes: number[] = [];
  semestres: Semestre[] = [];

  constructor(
    public dialogRef: MatDialogRef<AlocaAulaComponent>,
    private formBuilder: FormBuilder,
    private turmaService: TurmaService,
    private localService: LocalService,
    private horarioService: HorarioService,
    private semestreService: SemestreService,
    private allocateService: AllocateService,
    public dialog: MatDialog,
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
      selectedTimes:[],
      location: null,
      semester: null,
      type: 'Aula',
      weekDay: null,
      active: true
    });
  }

  get selectedTimesFormArray(): FormArray {
    return this.form.get('selectedTimes') as FormArray;
  }

  ngOnInit(): void {
    this.turmaService.listar().subscribe(turmas => {
      this.turmas = turmas;
    });

    this.localService.getLocaisAtivos().subscribe(locais => {
      this.locais = locais;
    });

    this.semestreService.listar().subscribe(semestres => {
       this.semestres = semestres;
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
        selectedTimes: [],
        semester: null,
        location: null,
        type: 'Aula',
        weekDay: null,
        active: true
      });
    }
  }

  onSubmit() {
    if (this.form.valid){
      const selectedClasse = this.turmas.find(obj => obj._id == this.form.value.classe);
      const selectedLocation = this.locais.find(obj => obj._id == this.form.value.location);

      this.indexTimes.forEach(hr => {
        const selectedHour = this.horarios.find(obj => obj._id == hr);
        if (selectedHour){
          this.selectedTimes.push(selectedHour);
        }
      })

      if(this.form.value.startDate === null || this.form.value.endDate === null){
        this.form.patchValue({startDate: this.form.value.lesson.semester.startDate});
        this.form.patchValue({endDate: this.form.value.lesson.semester.endDate});
      }

      if (selectedClasse && selectedLocation ) {
        this.form.patchValue({ classe: selectedClasse });
        this.form.patchValue({ location: selectedLocation });
        this.form.patchValue({ selectedTimes: this.selectedTimes })
      }

      console.log(this.form.value)

      this.allocateService.save(this.form.value).subscribe(result => this.onSucess(), error => this.onFailed());
    } else {
      const missingFields = [];
      
      if (this.form.get('classe')?.hasError('required')) {
        missingFields.push('<li>Selecione uma Classe</li>');
      }

      if (this.form.get('location')?.hasError('required')) {
        missingFields.push('<li>Selecione um Local</li>');
      }

      if (this.form.get('periodo')?.hasError('required')) {
        missingFields.push('<li>Selecione um Período</li>');
      }

      if (this.form.get('weekDay')?.hasError('required')) {
        missingFields.push('<li>Selecione o Dia da Semana</li>');
      }
      
      // if (this.form.get('acronym')?.hasError('required')) {
      //   missingFields.push('<li>Sigla (pelo menos 3 caracteres)</li>');
      // } else if (this.form.get('acronym')?.value.length < 3) {
      //   missingFields.push('<li>Sigla (pelo menos 3 caracteres)</li>');
      // } else if (this.form.get('acronym')?.value.length > 8) {
      //   missingFields.push('<li>Sigla (Máximo de 8 caracteres) </li>');
      // }
      
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


  toggleFields() {
    const periodo = (document.getElementById("periodoSelect") as HTMLSelectElement).value;
    const dataInicial = document.getElementById("dataInicial");
    const dataFim = document.getElementById("dataFim");

    if (periodo === "dia") {
      dataInicial?.classList.remove("hidden");
      dataFim?.classList.remove("hidden");
    } else if (periodo === "semestre") {
      dataInicial?.classList.add("hidden");
      dataFim?.classList.add("hidden");
    }
  }
}
