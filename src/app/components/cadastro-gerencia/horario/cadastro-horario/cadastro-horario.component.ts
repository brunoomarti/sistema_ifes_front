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

}
