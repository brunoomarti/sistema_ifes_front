import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlunoService } from '../service/aluno.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Aluno } from '../../../../models/Aluno';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-cadastro-aluno',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatTableModule
  ],
  templateUrl: './cadastro-aluno.component.html',
  styleUrl: './cadastro-aluno.component.css'
})
export class CadastroAlunoComponent implements OnInit {

  form: FormGroup;
  mensagemSnackbarAcerto: string = 'Aluno(a) cadastrado(a) com sucesso.';
  mensagemSnackbarErro: string = 'Erro ao cadastrar aluno(a).';

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private service: AlunoService,
    private snackBar: MatSnackBar,
  )

  {
    this.form = this.formBuilder.group({
      _id: [0],
      name: '',
      studentCode: ['']
    });

    this.form.get('studentCode')?.setValue(this.gerarCodigo());
  }

  ngOnInit(): void {
    const obj: Aluno = this.route.snapshot.data['aluno'];
    if (obj) {
      this.form.setValue({
        _id: obj._id,
        name: obj.name,
        barcode: obj.studentCode
      });
    }
  }

  onSubmit() {
    console.log(this.form.value);
    this.service.save(this.form.value).subscribe(result => {
      this.onSucess();
      this.router.navigate(['/cadastro-gerencia']);
    }, error => this.onFailed());
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


}
