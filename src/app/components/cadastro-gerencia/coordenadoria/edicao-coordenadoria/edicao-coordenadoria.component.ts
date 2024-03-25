import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { CoordenadoriaService } from '../service/coordenadoria.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReloadService } from '../../../../shared-services/reload.service';
import { Coordenadoria } from '../../../../models/Coordenadoria';

@Component({
  selector: 'app-edicao-coordenadoria',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatIcon
  ],
  templateUrl: './edicao-coordenadoria.component.html',
  styleUrl: './edicao-coordenadoria.component.css'
})
export class EdicaoCoordenadoriaComponent implements OnInit {

  form: FormGroup;
  mensagemSnackbarAcerto: string = 'Coordenadoria editada com sucesso.';
  mensagemSnackbarErro: string = 'Erro ao editar coordenadoria.';

  constructor(
    public dialogRef: MatDialogRef<EdicaoCoordenadoriaComponent>,
    private formBuilder: FormBuilder,
    private service: CoordenadoriaService,
    private snackBar: MatSnackBar,
    private reloadService: ReloadService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  )

  {
    this.form = this.formBuilder.group({
      _id: [0],
      name: [''],
      acronym: [''],
      description: ['']
    });
  }

  ngOnInit(): void {
    const obj: Coordenadoria = this.data.coordenadoria;
    if (obj) {
      this.form.setValue({
        _id: obj._id,
        name: obj.name,
        acronym: obj.acronym,
        description: obj.description
      });
    }
  }

  onSubmit() {
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
