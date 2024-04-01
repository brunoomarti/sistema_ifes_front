import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { ProfessorService } from '../service/professor.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { ReloadService } from '../../../../shared-services/reload.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Professor } from '../../../../models/Professor';

@Component({
  selector: 'app-edicao-professor',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatIcon
  ],
  templateUrl: './edicao-professor.component.html',
  styleUrl: './edicao-professor.component.css'
})
export class EdicaoProfessorComponent implements OnInit {

  form: FormGroup;
  mensagemSnackbarAcerto: string = 'Professor editado com sucesso.';
  mensagemSnackbarErro: string = 'Erro ao editar professor.';

  constructor(
    public dialogRef: MatDialogRef<EdicaoProfessorComponent>,
    private formBuilder: FormBuilder,
    private service: ProfessorService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private reloadService: ReloadService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  )

  {
    this.form = this.formBuilder.group({
      _id: [0],
      name: '',
      educationLevel: 'Licenciatura',
      specialty: '',
      isCoordinator: false,
      coordination: '',
      teacherCode: ''
    });
  }

  ngOnInit(): void {
    const obj: Professor = this.data.professor;
    if (obj) {
      this.form.setValue({
        _id: obj._id,
        name: obj.name,
        educationLevel: obj.educationLevel,
        specialty: obj.specialty,
        isCoordinator: obj.isCoordinator,
        coordination: obj.coordination,
        teacherCode: obj.teacherCode
      });
    }
  }

  onSubmit() {
    console.log(this.form.value.isCoordinator)
    this.service.save(this.form.value).subscribe(result => this.onSucess(), error => this.onFailed());
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSucess() {
    this.snackBar.open(this.mensagemSnackbarAcerto, '', { duration: 5000, panelClass: ['successSnackbar'] });
    this.reloadService.triggerReload();
    this.dialogRef.close();
  }

  onFailed() {
    this.snackBar.open(this.mensagemSnackbarErro, '', { duration: 5000, panelClass: ['errorSnackbar'] });
    this.dialogRef.close();
  }

}
