import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { SemestreService } from '../service/semestre.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReloadService } from '../../../../shared-services/reload.service';
import { Semestre } from '../../../../models/Semestre';
import { ModalDialogOkComponent } from '../../../modal-dialog/modal-dialog-ok/modal-dialog-ok.component';

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

  semestres: Semestre[] = [];
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
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
  )

  {
    this.anoMaximo = new Date().getFullYear();
    this.form = this.formBuilder.group({
      _id: 0,
      semesterYear: [new Date().getFullYear(), Validators.required],
      semesterPartition: ['1', Validators.required],
      semester: null,
      startDate: ['', Validators.required],
      endDate: ['', Validators.required]
    });
  }

  ngOnInit(): void {

    const obj: Semestre = this.data.semestre;
    if (obj) {
      const [year, partition] = obj.semester.split('/');
      console.log(obj);
      this.form.setValue({
        _id: obj._id,
        semesterYear: parseInt(year, 10),
        semesterPartition: parseInt(partition, 10),
        semester: null,
        startDate: obj.startDate,
        endDate: obj.endDate
      });
    }
  }

  onSubmit() {
    const semesterYear = this.form.get('semesterYear')?.value;
    const semesterPartition = this.form.get('semesterPartition')?.value;
    const startDate = new Date(this.form.get('startDate')?.value);
    const endDate = new Date(this.form.get('endDate')?.value);

    const semester = `${semesterYear}/${semesterPartition}`;
    this.form.patchValue({ semester: semester });

    if (this.form.valid) {
      this.service.listar().subscribe(semestres => {
        this.semestres = semestres;

        const editedSemesterId = this.form.get('_id')?.value;

        const overlappingSemester = this.semestres.some(semestre => {
          const semStartDate = new Date(semestre.startDate);
          const semEndDate = new Date(semestre.endDate);
          return (startDate >= semStartDate && startDate <= semEndDate && semestre._id !== editedSemesterId) ||
                 (endDate >= semStartDate && endDate <= semEndDate && semestre._id !== editedSemesterId);
        });

        if (overlappingSemester) {
          const dialogData = {
            title: 'Erro ao Cadastrar',
            message: 'Não é possível intercalar datas de semestres.'
          };
          this.openOkDialog(dialogData);
        } else if (endDate <= startDate) {
          const dialogData = {
            title: 'Erro ao Cadastrar',
            message: 'A data de término do semestre precisa ser maior que a data de início.'
          };
          this.openOkDialog(dialogData);
        } else {
          const duplicateSemester = this.semestres.some(semestre => semestre.semester === semester && semestre._id !== editedSemesterId);
          if (duplicateSemester) {
            const dialogData = {
              title: 'Erro ao Cadastrar',
              message: 'Já existe um semestre com o mesmo ano e partição.'
            };
            this.openOkDialog(dialogData);
          } else {
            this.save();
          }
        }
      });
    } else {
      const missingFields = [];
      if (this.form.get('semesterYear')?.hasError('required')) {
        missingFields.push('<li>Ano do semestre</li>');
      }
      if (this.form.get('semesterPartition')?.hasError('required')) {
        missingFields.push('<li>Partição</li>');
      }
      if (this.form.get('startDate')?.hasError('required')) {
        missingFields.push('<li>Data de início</li>');
      }
      if (this.form.get('endDate')?.hasError('required')) {
        missingFields.push('<li>Data de finalização</li>');
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
