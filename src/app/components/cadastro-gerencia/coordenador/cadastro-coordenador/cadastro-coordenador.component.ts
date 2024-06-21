import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Coordenador } from '../../../../models/Coordenador';
import { CoordenadorService } from '../service/coordenador.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { ModalDialogComponent } from '../../../modal-dialog/modal-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { CoordenadoriaService } from '../../coordenadoria/service/coordenadoria.service';
import { Coordenadoria } from '../../../../models/Coordenadoria';
import { ModalDialogOkComponent } from '../../../modal-dialog/modal-dialog-ok/modal-dialog-ok.component';
import { Aula } from '../../../../models/Aula';

@Component({
  selector: 'app-cadastro-coordenador',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatTableModule
  ],
  templateUrl: './cadastro-coordenador.component.html',
  styleUrl: './cadastro-coordenador.component.css'
})
export class CadastroCoordenadorComponent {

  aulas: Aula[] = [];
  form: FormGroup;
  mensagemSnackbarAcerto: string = 'Coordenador cadastrado com sucesso.';
  mensagemSnackbarErro: string = 'Erro ao cadastrar coordenador.';
  coordenadorias: Coordenadoria[] = [];

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private service: CoordenadorService,
    private coordinationService: CoordenadoriaService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  )

  {
    this.form = this.formBuilder.group({
      _id: [0],
      name: ['', [Validators.required, Validators.minLength(3)]],
      coordination: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.coordinationService.listar().subscribe(coordenadorias => {
      this.coordenadorias = coordenadorias;
    });

    const coord: Coordenador = this.route.snapshot.data['coordenador'];

    if (coord) {
      this.form.setValue({
        _id: coord._id,
        name: coord.name,
        coordination: coord.coordination
      });
    }
  }

  onSubmit() {
    if (this.form.invalid) {
        const missingFields = [];
        if (this.form.get('name')?.hasError('required')) {
            missingFields.push('<li>Nome</li>');
        }
        if (this.form.get('name')?.hasError('minlength')) {
            missingFields.push('<li>O nome deve ter pelo menos 3 caracteres</li>');
        }
        if (this.form.get('coordination')?.hasError('required')) {
            missingFields.push('<li>Coordenadoria</li>');
        }
        const dialogDataForm = {
            title: 'Erro ao Cadastrar',
            message: `É necessário que os seguintes campos sejam preenchidos: ${missingFields.join('')}`,
        };
        this.openOkDialog(dialogDataForm);
    } else {
      this.save();
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
          title: 'Coordenador Cadastrado',
          message: `O coordenador ${result.name} foi cadastrado.`,
          buttons: {
            cadastrarNovo: 'Cadastrar Novo Coordenador',
            irParaGerencia: 'Ver Coordenadores Cadastrados'
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
        this.form.get('name')?.setValue('');
        this.form.get('shift')?.setValue('Matutino');
      } else {
        this.router.navigate(['/cadastro-gerencia/gerencia-coordenador']);
      }
    });
  }

}
