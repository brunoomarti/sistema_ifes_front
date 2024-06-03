import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { CursoService } from '../service/curso.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReloadService } from '../../../../shared-services/reload.service';
import { Curso } from '../../../../models/Curso';
import { ModalDialogOkComponent } from '../../../modal-dialog/modal-dialog-ok/modal-dialog-ok.component';

@Component({
  selector: 'app-edicao-curso',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatIcon
  ],
  templateUrl: './edicao-curso.component.html',
  styleUrl: './edicao-curso.component.css'
})
export class EdicaoCursoComponent implements OnInit {

  cursos: Curso[] = [];
  form: FormGroup;
  mensagemSnackbarAcerto: string = 'Curso editado com sucesso.';
  mensagemSnackbarErro: string = 'Erro ao editar curso.';

  constructor(
    public dialogRef: MatDialogRef<EdicaoCursoComponent>,
    private formBuilder: FormBuilder,
    private service: CursoService,
    private snackBar: MatSnackBar,
    private reloadService: ReloadService,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: Curso,
  )

  {
    this.form = this.formBuilder.group({
      _id: 0,
      name: ['', Validators.required],
      identityNumber: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    console.log(this.data);
    if (this.data) {
      this.form.setValue({
        _id: this.data.obj._id,
        name: this.data.obj.name,
        identityNumber: this.data.obj.identityNumber
      });
    }
  }

  onSubmit() {
    if (this.form.valid) {
      let name = this.form.get('name')?.value;
      let identityNumber = this.form.get('identityNumber')?.value;
      name = name.toLowerCase();

      const editedCourseId = this.form.get('_id')?.value;

      this.service.listar().subscribe(cursos => {
          this.cursos = cursos;

          const errors = [];

          const duplicateName = this.cursos.some(curso => curso.name.toLowerCase() === name && curso._id !== editedCourseId);
          const duplicateIdentity = this.cursos.some(curso => curso.identityNumber === identityNumber && curso._id !== editedCourseId);

          if (duplicateName) {
              errors.push('Já existe um registro com o mesmo nome.');
          }
          if (duplicateIdentity) {
              errors.push('Já existe um registro com esse número de identificação.');
          }

          if (errors.length > 0) {
              const dialogData = {
                  title: 'Erro ao Cadastrar',
                  message: errors.join('<br>')
              };
              this.dialog.open(ModalDialogOkComponent, {
                  data: dialogData,
                  backdropClass: 'backdropTwo'
              });
          } else {
              this.save();
          }
      });
  } else {
      const missingFields = [];
      if (this.form.get('name')?.hasError('required')) {
        missingFields.push('<li>Nome</li>');
      }
      if (this.form.get('identityNumber')?.hasError('required')) {
        missingFields.push('<li>Número de identificação (4 caracteres)</li>');
      } else if (this.form.get('identityNumber')?.value.length != 4) {
        missingFields.push('<li>Número de identificação (4 caracteres)</li>');
      }
      const dialogDataForm = {
        title: 'Erro ao Cadastrar',
        message: `É necessário que os seguintes campos sejam preenchidos: ${missingFields.join('')}`,
      };

      this.dialog.open(ModalDialogOkComponent, {
        data: dialogDataForm,
        backdropClass: 'backdropTwo'
      });
    }
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
    this.reloadService.triggerReload();
  }

  onFailed() {
    this.snackBar.open(this.mensagemSnackbarErro, '', { duration: 5000, panelClass: ['errorSnackbar'] });
    this.dialogRef.close();
  }

}
