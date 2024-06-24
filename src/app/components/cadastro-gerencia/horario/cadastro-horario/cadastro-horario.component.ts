import { CommonModule, DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { HorarioService } from '../service/horario.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Horario } from '../../../../models/Horario';
import { ModalDialogComponent } from '../../../modal-dialog/modal-dialog.component';
import { ModalDialogOkComponent } from '../../../modal-dialog/modal-dialog-ok/modal-dialog-ok.component';
import { DialogConfirmacaoSaveComponent } from './dialog-confirmacao-save/dialog-confirmacao-save.component';

@Component({
  selector: 'app-cadastro-horario',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatTableModule
  ],
  templateUrl: './cadastro-horario.component.html',
  styleUrl: './cadastro-horario.component.css'
})
export class CadastroHorarioComponent implements OnInit {

  horarios: Horario[] = [];
  form: FormGroup;
  mensagemSnackbarAcerto: string = 'Horário cadastrado com sucesso.';
  mensagemSnackbarErro: string = 'Erro ao cadastrar horário.';

  @ViewChild('startTimeField') startTimeField!: ElementRef;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private service: HorarioService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
    )
  {
    this.form = this.formBuilder.group({
      _id: [0],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const obj: Horario = this.route.snapshot.data['horario'];
    if (obj) {
      this.form.setValue({
        _id: obj._id,
        startTime: obj.startTime,
        endTime: obj.endTime
      });
    }
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
        this.horarios = horarios;

        const errors = [];

        const overlappingHorario = this.horarios.some(horario => {
          const horarioInicio = new Date(`2000-01-01T${horario.startTime}`);
          const horarioFim = new Date(`2000-01-01T${horario.endTime}`);
          const novoHorarioInicio = new Date(`2000-01-01T${startTime}`);
          const novoHorarioFim = new Date(`2000-01-01T${endTime}`);
          return (novoHorarioInicio >= horarioInicio && novoHorarioInicio <= horarioFim) ||
                 (novoHorarioFim >= horarioInicio && novoHorarioFim <= horarioFim);
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
      backdropClass: 'backdrop'
    });
  }

  save() {
    this.service.save(this.form.value).subscribe(
      result => {
        const formattedTimeRange = `${this.form.value.startTime} ~ ${this.form.value.endTime}`;

        const dialogData = {
          title: 'Horário Cadastrado',
          message: `O horário ${formattedTimeRange} foi cadastrado.`,
          buttons: {
            cadastrarNovo: 'Cadastrar Novo Horário',
            irParaGerencia: 'Ver Horários Cadastrados'
          }
        };
        this.openDialog(dialogData);
      },
      error => {
        this.onFailed();
      }
    );
  }

  onCancel() {
    if (confirm('Tem certeza que deseja cancelar?')) {
      this.router.navigate(['/cadastro-gerencia']);
    }
  }

  onFailed() {
    this.snackBar.open(this.mensagemSnackbarErro, '', { duration: 5000, panelClass: ['errorSnackbar'] });
  }

  onSucess() {
    this.snackBar.open(this.mensagemSnackbarAcerto, '', { duration: 5000, panelClass: ['successSnackbar'] });
  }

  openDialog(data: any): void {
    const dialogRef = this.dialog.open(ModalDialogComponent, {
      data: data,
      disableClose: true,
      backdropClass: 'backdrop'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'cadastrarNovo') {
        this.form.get('startTime')?.setValue('');
        this.form.get('endTime')?.setValue('');
        this.startTimeField.nativeElement.focus();
      } else {
        this.router.navigate(['/cadastro-gerencia/gerencia-horario']);
      }
    });
  }

  presetSave(): void {
    const horariosPreSetados = [
      { "_id": 0, "startTime": "07:00", "endTime": "07:49" },
      { "_id": 0, "startTime": "07:50", "endTime": "08:39" },
      { "_id": 0, "startTime": "08:40", "endTime": "09:29" },
      { "_id": 0, "startTime": "09:50", "endTime": "10:39" },
      { "_id": 0, "startTime": "10:40", "endTime": "11:29" },
      { "_id": 0, "startTime": "11:30", "endTime": "12:19" },
      { "_id": 0, "startTime": "13:00", "endTime": "13:49" },
      { "_id": 0, "startTime": "13:50", "endTime": "14:39" },
      { "_id": 0, "startTime": "14:40", "endTime": "15:29" },
      { "_id": 0, "startTime": "15:50", "endTime": "16:39" },
      { "_id": 0, "startTime": "16:40", "endTime": "17:29" },
      { "_id": 0, "startTime": "17:30", "endTime": "18:19" },
      { "_id": 0, "startTime": "18:50", "endTime": "19:34" },
      { "_id": 0, "startTime": "19:35", "endTime": "20:19" },
      { "_id": 0, "startTime": "20:30", "endTime": "21:14" },
      { "_id": 0, "startTime": "21:15", "endTime": "22:00" }
    ];

    const dialogData = {
      title: 'Confirmação de Cadastro',
      message: 'Você está prestes a salvar 16 horários que foram pré-selecionados. Caso já exista algum dos seguintes horários no sistema, o mesmo não será salvo. Deseja continuar?',
      horarios: horariosPreSetados.map(h => `${h.startTime} - ${h.endTime}`).join('<br>')
    };

    const dialogRef = this.dialog.open(DialogConfirmacaoSaveComponent, {
      data: dialogData,
      backdropClass: 'backdropTwo'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'sim') {
        this.service.listar().subscribe((horariosExistentes: Horario[]) => {
          const horariosNaoExistentes = horariosPreSetados.filter(hPreSetado =>
            !horariosExistentes.some(hExistente =>
              hExistente.startTime === hPreSetado.startTime && hExistente.endTime === hPreSetado.endTime
            )
          );

          if (horariosNaoExistentes.length > 0) {
            const horariosSalvos: Horario[] = [];
            horariosNaoExistentes.forEach(horario => {
              this.service.save(horario).subscribe(() => {
                horariosSalvos.push(horario);
                if (horariosSalvos.length === horariosNaoExistentes.length) {
                  const horariosSalvosMensagem = horariosSalvos.map(h => `${h.startTime} - ${h.endTime}`).join('<br>');
                  this.openOkDialog({
                    title: 'Horários Salvos',
                    message: `Os seguintes horários foram salvos:<br>${horariosSalvosMensagem}`
                  });
                }
              }, error => {
                this.snackBar.open(`Erro ao salvar o horário ${horario.startTime} - ${horario.endTime}.`, '', { duration: 5000, panelClass: ['errorSnackbar'] });
              });
            });
          } else {
            this.openOkDialog({
              title: 'Horários Existentes',
              message: 'Todos os horários já existem no sistema. Nenhum horário foi salvo.'
            });
          }
        });
      }
    });
  }
}
