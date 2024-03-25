import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { SemestreService } from '../service/semestre.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Semestre } from '../../../../models/Semestre';
import { ModalDialogComponent } from '../../../modal-dialog/modal-dialog.component';

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
      semesterYear: [new Date().getFullYear()],
      semesterPartition: '1',
      semester: null,
      startDate: [''],
      endDate: ['']
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

    const semesterYear = this.form.get('semesterYear');
    const semesterPartition = this.form.get('semesterPartition');
    const semester = `${semesterYear}/${semesterPartition}`;
    this.form.patchValue({ semester: semester });

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
