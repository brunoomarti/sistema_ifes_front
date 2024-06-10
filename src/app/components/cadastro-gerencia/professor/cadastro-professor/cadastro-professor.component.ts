import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfessorService } from '../service/professor.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Professor } from '../../../../models/Professor';
import { ModalDialogComponent } from '../../../modal-dialog/modal-dialog.component';
import { Coordenadoria } from '../../../../models/Coordenadoria';
import { CoordenadoriaService } from '../../coordenadoria/service/coordenadoria.service';
import { ModalDialogOkComponent } from '../../../modal-dialog/modal-dialog-ok/modal-dialog-ok.component';

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

  professores: Professor[] = [];
  form: FormGroup;
  mensagemSnackbarAcerto: string = 'Professor cadastrado com sucesso.';
  mensagemSnackbarErro: string = 'Erro ao cadastrar professor.';
  coordenadorias: Coordenadoria[] = [];

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private service: ProfessorService,
    private coordinationService: CoordenadoriaService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  )

  {
    this.form = this.formBuilder.group({
      _id: [0],
      name: ['', Validators.required],
      educationLevel: ['Licenciatura', Validators.required],
      coordinator: [false, Validators.required],
      coordination: ['', Validators.required],
      teacherCode: ['', Validators.required]
    });
    this.form.get('teacherCode')?.setValue(this.gerarCodigo());
  }

  ngOnInit(): void {
    this.coordinationService.listar().subscribe(coordenadorias => {
      this.coordenadorias = coordenadorias;

    this.service.listar().subscribe(professores => {
      this.professores = professores;
    });

    });

    const obj: Professor = this.route.snapshot.data['professor'];
    if (obj) {
      this.form.setValue({
        _id: obj._id,
        name: obj.name,
        educationLevel: obj.educationLevel,
        coordinator: obj.coordinator,
        coordination: obj.coordination,
        teacherCode: obj.teacherCode
      });
    }
  }

  onSubmit() {
      if (this.form.valid) {
        let coordenador = this.form.get('coordinator')?.value;
        let coordenacao = this.form.get('coordination')?.value;

        const errors: string[] = [];

        if (coordenador){
          const professoresDaCoordenacao = this.professores.filter(professor => professor.coordination._id == this.form.value.coordination);
          let coordenadorPresente;
          let nomeCoord;

          console.log(professoresDaCoordenacao);

          professoresDaCoordenacao.forEach(professor => {
            if (professor.coordinator){
              coordenadorPresente = professor.coordinator;
              nomeCoord = professor.name;
            }
            
          });

          if (coordenadorPresente) {
            errors.push(`Já existe um coordenador para este curso. Coordenador de curso atual: <strong>${nomeCoord}</strong>`);
          }

          if (errors.length > 0) {
            const dialogData = {
                title: 'Erro ao Cadastrar',
                message: errors.join('<br>')
            };
            this.openOkDialog(dialogData);
          } else {
            this.save();
          }

      } else {
        this.save();
      }
        
    } else {
        const missingFields = [];
        if (this.form.get('name')?.hasError('required')) {
            missingFields.push('<li>Nome</li>');
        }
        if (this.form.get('educationLevel')?.hasError('required')) {
            missingFields.push('<li>Grau acadêmico</li>');
        }
        if (this.form.get('coordination')?.hasError('required')) {
            missingFields.push('<li>Coordenadoria</li>');
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
    const selectedCoordination = this.coordenadorias.find(coord => coord._id == this.form.value.coordination);

    if (selectedCoordination) {
        this.form.patchValue({ coordination: selectedCoordination });
    }

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
