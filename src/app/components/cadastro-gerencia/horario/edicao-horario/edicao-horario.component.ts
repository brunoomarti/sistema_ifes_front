import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { HorarioService } from '../service/horario.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReloadService } from '../../../../shared-services/reload.service';
import { Horario } from '../../../../models/Horario';

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

  form: FormGroup;
  mensagemSnackbarAcerto: string = 'Horário editado com sucesso.';
  mensagemSnackbarErro: string = 'Erro ao editar horário.';

  constructor(
    public dialogRef: MatDialogRef<EdicaoHorarioComponent>,
    private formBuilder: FormBuilder,
    private service: HorarioService,
    private snackBar: MatSnackBar,
    private reloadService: ReloadService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  )

  {
    this.form = this.formBuilder.group({
      _id: 0,
      startTime: '',
      endTime: ''
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

  converterParaDate(hora: string){
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

    // Formata a hora e minuto para garantir o formato "HH:mm"
    const horaFormatada = `${horasInt.toString().padStart(2, '0')}:${minutosInt.toString().padStart(2, '0')}`;
    return horaFormatada;
  }


  onSubmit() {
    this.form.value.startTime = this.formatarHora(this.form.value.startTime);
    this.form.value.endTime = this.formatarHora(this.form.value.endTime);

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
