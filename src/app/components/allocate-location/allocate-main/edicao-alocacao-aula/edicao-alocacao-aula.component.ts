import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { AllocateService } from '../service/allocate.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReloadService } from '../../../../shared-services/reload.service';
import { Alocar } from '../../../../models/Alocar';

@Component({
  selector: 'app-edicao-alocacao-aula',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatIcon
  ],
  templateUrl: './edicao-alocacao-aula.component.html',
  styleUrl: './edicao-alocacao-aula.component.css'
})
export class EdicaoAlocacaoAulaComponent implements OnInit {

  form: FormGroup;
  mensagemSnackbarAcerto: string = 'Alocação de aula editada com sucesso.';
  mensagemSnackbarErro: string = 'Erro ao editar alocação de aula.';

  constructor(
    public dialogRef: MatDialogRef<EdicaoAlocacaoAulaComponent>,
    private formBuilder: FormBuilder,
    private service: AllocateService,
    private snackBar: MatSnackBar,
    private reloadService: ReloadService,
    @Inject(MAT_DIALOG_DATA) public data: Alocar,
  )

  {
    this.form = this.formBuilder.group({
      _id: [0],
    });
  }

  ngOnInit(): void {
    const obj: Alocar = this.data;
    console.log(this.data);
    if (obj) {
      this.form.setValue({
        _id: obj._id
      });
    }
  }

  onSubmit() {
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
