import { Curso } from './../../../../models/Curso';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlunoService } from '../service/aluno.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Aluno } from '../../../../models/Aluno';
import { MatDialog } from '@angular/material/dialog';
import { ModalDialogComponent } from '../../../modal-dialog/modal-dialog.component';
import { CursoService } from '../../curso/service/curso.service';
import { ModalDialogOkComponent } from '../../../modal-dialog/modal-dialog-ok/modal-dialog-ok.component';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-cadastro-aluno',
  templateUrl: './cadastro-aluno.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatTableModule
  ],
  styleUrls: ['./cadastro-aluno.component.css']
})
export class CadastroAlunoComponent implements OnInit {

  form: FormGroup;
  mensagemSnackbarAcerto: string = 'Aluno(a) cadastrado(a) com sucesso.';
  mensagemSnackbarErro: string = 'Erro ao cadastrar aluno(a).';
  cursos: Curso[] = [];
  currentYear: number;
  selectedCourse: any;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private service: AlunoService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private cursoService: CursoService
  ) {
    this.currentYear = new Date().getFullYear();

    this.form = this.formBuilder.group({
      id: [0],
      name: ['', Validators.required],
      registrationYear: ['', [Validators.required, Validators.min(1960), Validators.max(this.currentYear)]],
      course: [null, Validators.required],
      studentCode: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const obj: Aluno = this.route.snapshot.data['aluno'];
    if (obj) {
      this.form.setValue({
        id: obj._id,
        name: obj.name,
        registrationYear: obj.registrationYear,
        course: obj.course,
        studentCode: obj.studentCode
      });
    }

    this.cursoService.listar().subscribe(cursos => {
      this.cursos = cursos;
    });
  }

  onCourseChange(): void {
    this.checkAndGenerateCode();
  }

  onYearChange(): void {
    this.checkAndGenerateCode();
  }

  setCurrentYear(): void {
    this.form.get('registrationYear')?.setValue(this.currentYear);
    this.checkAndGenerateCode();
  }

  checkAndGenerateCode(): void {
    const studentYear = this.form.get('registrationYear')?.value;
    const selectedCourseId = this.form.get('course')?.value;

    if (studentYear && selectedCourseId) {
      this.gerarCodigo();
    }
  }

  onSubmit() {
    if (this.form.invalid) {
      const missingFields: string[] = [];
      if (this.form.get('name')?.hasError('required')) {
        missingFields.push('<li>Nome</li>');
      }
      const selectedCourse = this.cursos.find(obj => obj._id == this.form.value.course);
      if (!selectedCourse) {
        missingFields.push('<li>Curso</li>');
      }
      if (this.form.get('registrationYear')?.hasError('required')) {
        missingFields.push('<li>Ano de matrícula</li>');
      }
      const dialogDataForm = {
        title: 'Erro ao Cadastrar',
        message: `É necessário que os seguintes campos sejam preenchidos: ${missingFields.join('')}`,
      };

      this.dialog.open(ModalDialogOkComponent, {
        data: dialogDataForm,
        backdropClass: 'backdrop'
      });
    } else {
      this.save();
    }
  }

  save() {
    const selectedCourse = this.cursos.find(obj => obj._id == this.form.value.course);

    if (selectedCourse) {
      this.form.patchValue({ course: selectedCourse });
    }

    this.service.save(this.form.value).subscribe(
      result => {
        const dialogData = {
          title: 'Aluno Cadastrado',
          message: `O aluno ${result.name} foi cadastrado.`,
          buttons: {
            cadastrarNovo: 'Cadastrar Novo Aluno',
            irParaGerencia: 'Ver Alunos Cadastrados'
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
      this.router.navigate(['/cadastro-gerencia/gerencia-aluno']);
    }
  }

  onFailed() {
    this.snackBar.open(this.mensagemSnackbarErro, '', { duration: 5000, panelClass: ['errorSnackbar'] });
  }

  onSucess() {
    this.snackBar.open(this.mensagemSnackbarAcerto, '', { duration: 5000, panelClass: ['successSnackbar'] });
  }

  gerarCodigo(): void {
    const studentYear = this.form.get('registrationYear')?.value;
    const selectedCourseId = this.form.get('course')?.value;

    if (!studentYear || !selectedCourseId) return;

    this.cursoService.loadById(selectedCourseId).subscribe(selectedCourse => {
      this.selectedCourse = selectedCourse;
      const courseCode: string = this.selectedCourse.identityNumber;

      const generateUniqueRandomNumbers = (alunos: Aluno[]): string => {
        let randomNumbers: string = '';
        let isUnique = false;
        while (!isUnique) {
          randomNumbers = Math.floor(10000 + Math.random() * 90000).toString();
          isUnique = !alunos.some(aluno => aluno.studentCode.endsWith(randomNumbers));
        }
        return randomNumbers;
      };

      this.service.listar().subscribe((alunos: Aluno[]) => {
        const randomNumbers: string = generateUniqueRandomNumbers(alunos);
        const studentCode: string = `${studentYear}${courseCode}${randomNumbers}`;
        this.form.get('studentCode')?.setValue(studentCode);
      });
    });
  }

  openDialog(data: any): void {
    const dialogRef = this.dialog.open(ModalDialogComponent, {
      data: data,
      disableClose: true,
      backdropClass: 'backdrop'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'cadastrarNovo') {
        this.form.get('name')?.setValue('');
        this.form.get('studentCode')?.setValue('');
      } else {
        this.router.navigate(['/cadastro-gerencia/gerencia-aluno']);
      }
    });
  }
}
