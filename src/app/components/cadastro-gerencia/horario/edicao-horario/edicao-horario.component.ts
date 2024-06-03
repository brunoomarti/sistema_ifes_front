import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { HorarioService } from '../service/horario.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReloadService } from '../../../../shared-services/reload.service';
import { Horario } from '../../../../models/Horario';
import { ModalDialogOkComponent } from '../../../modal-dialog/modal-dialog-ok/modal-dialog-ok.component';

@Component({
  selector: 'app-edicao-horario',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatIcon
  ],
  templateUrl: './edicao-horario.component.html',
  styleUrl: './edicao-horario.component.css'
})
export class EdicaoHorarioComponent implements OnInit {

  horarios: Horario[] = [];
  form: FormGroup;
  mensagemSnackbarAcerto: string = 'Horário editado com sucesso.';
  mensagemSnackbarErro: string = 'Erro ao editar horário.';

  constructor(
    public dialogRef: MatDialogRef<EdicaoHorarioComponent>,
    private formBuilder: FormBuilder,
    private service: HorarioService,
    private snackBar: MatSnackBar,
    private reloadService: ReloadService,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
  )

  {
    this.form = this.formBuilder.group({
      _id: 0,
      startTime: ['', Validators.required],
      endTime: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const obj: Horario = this.data.horario;
    if (obj) {
      this.form.setValue({
        _id: obj._id,
        startTime: obj.startTime,
        endTime: obj.endTime
      });
    }
  }

  converterParaDate(hora: string): Date {
    const [horas, minutos] = hora.split(":");
    const horasInt: number = parseInt(horas, 10);
    const minutosInt: number = parseInt(minutos, 10);

    const currentDateTime = new Date();
    currentDateTime.setHours(horasInt);
    currentDateTime.setMinutes(minutosInt);

    return currentDateTime;
  }


  formatarHora(hora: string): string {
    const [horas, minutos] = hora.split(":");

    const horasInt: number = parseInt(horas, 10);
    const minutosInt: number = parseInt(minutos, 10);

    const horaFormatada = `${horasInt.toString().padStart(2, '0')}:${minutosInt.toString().padStart(2, '0')}`;
    return horaFormatada;
  }

  onSubmit() {
    this.form.value.startTime = this.formatarHora(this.form.value.startTime);
    this.form.value.endTime = this.formatarHora(this.form.value.endTime);

    if (this.form.valid) {
      const startTime = this.form.get('startTime')?.value;
      const endTime = this.form.get('endTime')?.value;

      if (endTime < startTime) {
        const dialogData = {
          title: 'Erro ao Cadastrar',
          message: 'A hora de término não pode ser anterior à hora de início.'
        };
        this.openOkDialog(dialogData);
        return;
      }

      this.service.listar().subscribe(horarios => {
        const horariosParaComparar = horarios.filter(horario => horario._id !== this.form.value._id);

        const errors = [];

        const overlappingHorario = horariosParaComparar.some(horario => {
          const horarioInicio = new Date(`2000-01-01T${horario.startTime}`).getTime();
          const horarioFim = new Date(`2000-01-01T${horario.endTime}`).getTime();
          const novoHorarioInicio = new Date(`2000-01-01T${startTime}`).getTime();
          const novoHorarioFim = new Date(`2000-01-01T${endTime}`).getTime();

          return (novoHorarioInicio < horarioFim && novoHorarioFim > horarioInicio);
        });

        if (overlappingHorario) {
          errors.push('Não é possível intercalar horários ou cadastrar horários com o mesmo intervalo.');
        }

        if (errors.length > 0) {
          const dialogData = {
            title: 'Erro ao Cadastrar',
            message: errors.join('<br>')
          };
          this.openOkDialog(dialogData);
        } else {
          this.save();
        }
      });
    } else {
      const missingFields = [];
      if (this.form.get('startTime')?.hasError('required')) {
        missingFields.push('<li>Início</li>');
      }
      if (this.form.get('endTime')?.hasError('required')) {
        missingFields.push('<li>Fim</li>');
      }
      const dialogDataForm = {
        title: 'Erro ao Cadastrar',
        message: `É necessário que os seguintes campos sejam preenchidos: ${missingFields.join('')}`,
      };

      this.openOkDialog(dialogDataForm);
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
