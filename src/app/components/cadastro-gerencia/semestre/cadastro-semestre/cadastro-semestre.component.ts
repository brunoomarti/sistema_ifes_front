import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { SemestreService } from '../service/semestre.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Semestre } from '../../../../models/Semestre';
import { ModalDialogComponent } from '../../../modal-dialog/modal-dialog.component';
import { ModalDialogOkComponent } from '../../../modal-dialog/modal-dialog-ok/modal-dialog-ok.component';

@Component({
  selector: 'app-cadastro-semestre',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatTableModule
  ],
  templateUrl: './cadastro-semestre.component.html',
  styleUrl: './cadastro-semestre.component.css'
})
export class CadastroSemestreComponent implements OnInit {

  semestres: Semestre[] = [];
  anoMaximo: number;
  form: FormGroup;
  mensagemSnackbarAcerto: string = 'Semestre cadastrado com sucesso.';
  mensagemSnackbarErro: string = 'Erro ao cadastrar semestre.';

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private service: SemestreService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  )

  {
    this.anoMaximo = new Date().getFullYear();
    this.form = this.formBuilder.group({
      id: [0],
      semesterYear: [new Date().getFullYear(), Validators.required],
      semesterPartition: ['1', Validators.required],
      semester: null,
      startDate: ['', Validators.required],
      endDate: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const obj: Semestre = this.route.snapshot.data['semestre'];
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
    const semesterYear = this.form.get('semesterYear')?.value;
    const semesterPartition = this.form.get('semesterPartition')?.value;
    const startDate = new Date(this.form.get('startDate')?.value);
    const endDate = new Date(this.form.get('endDate')?.value);

    const semester = `${semesterYear}/${semesterPartition}`;
    this.form.patchValue({ semester: semester });

    if (this.form.valid) {
      this.service.listar().subscribe(semestres => {
        this.semestres = semestres;

        const overlappingSemester = this.semestres.some(semestre => {
          const semStartDate = new Date(semestre.startDate);
          const semEndDate = new Date(semestre.endDate);
          return (startDate >= semStartDate && startDate <= semEndDate) ||
                 (endDate >= semStartDate && endDate <= semEndDate);
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
          const duplicateSemester = this.semestres.some(semestre => semestre.semester === semester);

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
      backdropClass: 'backdrop'
    });
  }

  save() {
    this.service.save(this.form.value).subscribe(
      result => {
        const dialogData = {
          title: 'Semestre Cadastrado',
          message: `O semestre ${result.semester} foi cadastrado.`,
          buttons: {
            cadastrarNovo: 'Cadastrar Novo Semestre',
            irParaGerencia: 'Ver Semestres Cadastrados'
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
        this.form.get('semesterYear')?.setValue([new Date().getFullYear()]);
        this.form.get('semesterPartition')?.setValue('1');
        this.form.get('startDate')?.setValue('');
        this.form.get('endDate')?.setValue('');
      } else {
        this.router.navigate(['/cadastro-gerencia/gerencia-semestre']);
      }
    });
  }

}
