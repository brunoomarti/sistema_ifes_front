import { CommonModule, DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { HorarioService } from '../service/horario.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Horario } from '../../../../models/Horario';
import { ModalDialogComponent } from '../../../modal-dialog/modal-dialog.component';

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
      startTime: [''],
      endTime: ['']
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

    // Formata a hora e minuto para garantir o formato "HH:mm"
    const horaFormatada = `${horasInt.toString().padStart(2, '0')}:${minutosInt.toString().padStart(2, '0')}`;
    return horaFormatada;
  }

  onSubmit() {
    this.form.value.startTime = this.formatarHora(this.form.value.startTime);
    this.form.value.endTime = this.formatarHora(this.form.value.endTime);

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
