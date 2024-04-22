import { Turma } from './../../../../models/Turma';
import { CommonModule, DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
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
import { Semestre } from '../../../../models/Semestre';
import { SemestreService } from '../../../cadastro-gerencia/semestre/service/semestre.service';

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
  semestres: Semestre[] = [];

  constructor(
    public dialogRef: MatDialogRef<AlocaAulaComponent>,
    private formBuilder: FormBuilder,
    private turmaService: TurmaService,
    private localService: LocalService,
    private horarioService: HorarioService,
    private semestreService: SemestreService,
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
      selectedTimes: new FormControl([]),
      location: null,
      semester: null,
      type: 'Aula'
    });
  }

  ngOnInit(): void {
    this.turmaService.listar().subscribe(turmas => {
      this.turmas = turmas;
    });

    this.localService.listar().subscribe(locais => {
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
        selectedTimes: null,
        semester: null,
        location: null,
        type: 'Aula'
      });
    }
  }

  onSubmit() {
    const selectedClasse = this.turmas.find(obj => obj._id == this.form.value.classe);

    const selectedLocation = this.locais.find(obj => obj._id == this.form.value.location);

    if (selectedClasse && selectedLocation) {
      this.form.patchValue({ classe: selectedClasse });
      this.form.patchValue({ location: selectedLocation });
    }

    const periodo = (document.getElementById("periodoSelect") as HTMLSelectElement).value;

    if (periodo === "semestre") {
      const selectedSemesterId = this.data.aula.semester;
      const selectedSemester = this.semestres.find(semestre => semestre._id === selectedSemesterId);

      if (selectedSemester) {
        const startDate = selectedSemester.startDate;
        const endDate = selectedSemester.endDate;
        this.form.patchValue({ startDate: startDate });
        this.form.patchValue({ endDate: endDate });
      }
    } else if (periodo === "dia") {
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

  listarHorarios(): void {
    this.horarioService.listar().subscribe(horarios => {
      this.horarios = horarios.map(horario => {
        return {
          _id: horario._id,
          startTime: this.formatarHora(horario.startTime),
          endTime: this.formatarHora(horario.endTime)
        };
      });
    });
  }

  formatarHora(time: String): String {
    const date = new Date(time.toString());
    const formattedTime = this.datePipe.transform(date, 'HH:mm');
    return formattedTime !== null ? formattedTime : '';
  }

  toggleFields() {
    const periodo = (document.getElementById("periodoSelect") as HTMLSelectElement).value;
    const dataInicial = document.getElementById("dataInicial");
    const semestre = document.getElementById("semestre");

    if (periodo === "dia") {
      dataInicial?.classList.remove("hidden");
      // semestre?.classList.add("hidden");
    } else if (periodo === "semestre") {
      dataInicial?.classList.add("hidden");
      // semestre?.classList.remove("hidden");
    }
  }

}
