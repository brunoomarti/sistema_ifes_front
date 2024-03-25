import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { SemestreService } from '../service/semestre.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReloadService } from '../../../../shared-services/reload.service';
import { Semestre } from '../../../../models/Semestre';

@Component({
  selector: 'app-edicao-semestre',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatIcon
  ],
  templateUrl: './edicao-semestre.component.html',
  styleUrl: './edicao-semestre.component.css'
})
export class EdicaoSemestreComponent implements OnInit {

  anoMaximo: number;
  form: FormGroup;
  mensagemSnackbarAcerto: string = 'Semestre editado com sucesso.';
  mensagemSnackbarErro: string = 'Erro ao editar semestre.';

  constructor(
    public dialogRef: MatDialogRef<EdicaoSemestreComponent>,
    private formBuilder: FormBuilder,
    private service: SemestreService,
    private snackBar: MatSnackBar,
    private reloadService: ReloadService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  )

  {
    this.anoMaximo = new Date().getFullYear();
    this.form = this.formBuilder.group({
      _id: [0],
      semesterYear: [new Date().getFullYear()],
      semesterPartition: '1',
      semester: null,
      startDate: [''],
      endDate: ['']
    });
  }

  ngOnInit(): void {
    const obj: Semestre = this.data.semestre;
    if (obj) {
      const [year, partition] = obj.semester.split('/');
      this.form.setValue({
        id: obj._id,
        semesterYear: parseInt(year, 10),
        semesterPartition: parseInt(partition, 10),
        startDate: obj.startDate,
        endDate: obj.endDate
      });
    }
  }

  onSubmit() {

    const semesterYear = this.form.get('semesterYear');
    const semesterPartition = this.form.get('semesterPartition');
    const semester = `${semesterYear}/${semesterPartition}`;
    this.form.patchValue({ semester: semester });
    
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
