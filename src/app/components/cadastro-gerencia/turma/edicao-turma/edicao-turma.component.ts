import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { TurmaService } from '../service/turma.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Turma } from '../../../../models/Turma';
import { ModalDialogOkComponent } from '../../../modal-dialog/modal-dialog-ok/modal-dialog-ok.component';

@Component({
  selector: 'app-edicao-turma',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatIcon
  ],
  templateUrl: './edicao-turma.component.html',
  styleUrl: './edicao-turma.component.css'
})
export class EdicaoTurmaComponent implements OnInit {

  turmas: Turma[] = [];
  form: FormGroup;
  mensagemSnackbarAcerto: string = 'Turma editada com sucesso.';
  mensagemSnackbarErro: string = 'Erro ao editar turma.';

  constructor(
    public dialogRef: MatDialogRef<EdicaoTurmaComponent>,
    private formBuilder: FormBuilder,
    private service: TurmaService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
  )

  {
    this.form = this.formBuilder.group({
      _id: 0,
      name: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const obj: Turma = this.data.turma;
    if (obj) {
      this.form.setValue({
        _id: obj._id,
        name: obj.name
      });
    }

    this.form.get('name')?.valueChanges.subscribe(value => {
      const upperCaseValue = value.toUpperCase();
      if (value !== upperCaseValue) {
        this.form.get('name')?.setValue(upperCaseValue, { emitEvent: false });
      }
    });
  }

  onSubmit() {
    if (this.form.valid) {
        let name = this.form.get('name')?.value;
        name = name.toLowerCase();

        const editedId = this.form.get('_id')?.value;

        const errors: string[] = [];

        const regex = /^[mvn]\d{2}$/i;
        if (!regex.test(name)) {
            errors.push('A turma deve ser escrita como o exemplo a seguir: <strong>M01</strong><br><br>A primeira letra DEVE ser M, V ou N e os outros dois caracteres devem ser números.');
        }

        this.service.listar().subscribe(turmas => {
            this.turmas = turmas;

            const duplicateName = this.turmas.some(turma => turma.name.toLowerCase() === name && turma._id !== editedId);

            if (duplicateName) {
                errors.push('Já existe um registro com o mesmo nome.');
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
        if (this.form.get('name')?.hasError('required')) {
            missingFields.push('<li>Nome</li>');
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
    console.log(this.form.value);
    this.service.save(this.form.value).subscribe(result => this.onSucess(), error => this.onFailed());
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSucess() {
    this.snackBar.open(this.mensagemSnackbarAcerto, '', { duration: 5000, panelClass: ['successSnackbar'] });
    this.dialogRef.close();
  }

  onFailed() {
    this.snackBar.open(this.mensagemSnackbarErro, '', { duration: 5000, panelClass: ['errorSnackbar'] });
    this.dialogRef.close();
  }

}
