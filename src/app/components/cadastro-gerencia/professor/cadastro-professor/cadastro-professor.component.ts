import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfessorService } from '../service/professor.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Professor } from '../../../../models/Professor';
import { ModalDialogComponent } from '../../../modal-dialog/modal-dialog.component';

@Component({
  selector: 'app-cadastro-professor',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatTableModule
  ],
  templateUrl: './cadastro-professor.component.html',
  styleUrl: './cadastro-professor.component.css'
})
export class CadastroProfessorComponent implements OnInit {

  form: FormGroup;
  mensagemSnackbarAcerto: string = 'Professor cadastrado com sucesso.';
  mensagemSnackbarErro: string = 'Erro ao cadastrar professor.';

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private service: ProfessorService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  )

  {
    this.form = this.formBuilder.group({
      _id: [0],
      name: '',
      educationLevel: 'Licenciatura',
      specialty: '',
      isCoordinator: false,
      coordination: null,
      teacherCode: ''
    });
    this.form.get('teacherCode')?.setValue(this.gerarCodigo());
  }

  ngOnInit(): void {
    const obj: Professor = this.route.snapshot.data['professor'];
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
    this.service.save(this.form.value).subscribe(
      result => {
        const dialogData = {
          title: 'Professor Cadastrado',
          message: `O professor ${result.name} foi cadastrado.`,
          buttons: {
            cadastrarNovo: 'Cadastrar Novo Professor',
            irParaGerencia: 'Ver Professores Cadastrados'
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

  gerarCodigo(): string {
    const codigoPais = '789';
    const numeroEmpresa = '000000';
    const idAlunoAleatorio = Math.floor(Math.random() * (999 - 100 + 1)) + 100;

    const codigoBarrasSemVerificador = codigoPais + numeroEmpresa + idAlunoAleatorio;
    const digitoVerificador = this.calcularDigitoVerificador(codigoBarrasSemVerificador);

    const codigoBarrasCompleto = codigoBarrasSemVerificador + digitoVerificador;

    return codigoBarrasCompleto;
  }

  calcularDigitoVerificador(codigoBarras: string): string {
      let soma = 0;
      let peso = 1;

      for (let i = codigoBarras.length - 1; i >= 0; i--) {
          const digito = parseInt(codigoBarras.charAt(i), 10);
          soma += digito * peso;
          peso = peso === 1 ? 3 : 1;
      }

      const digitoVerificador = (10 - (soma % 10)) % 10;

      return digitoVerificador.toString();
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
        this.form.get('educationLevel')?.setValue('Licenciatura');
        this.form.get('specialty')?.setValue('');
        this.form.get('coordinator')?.setValue('');
        this.form.get('coordination')?.setValue('');
        this.form.get('teacherCode')?.setValue(this.gerarCodigo());
      } else {
        this.router.navigate(['/cadastro-gerencia/gerencia-professor']);
      }
    });
  }

}
