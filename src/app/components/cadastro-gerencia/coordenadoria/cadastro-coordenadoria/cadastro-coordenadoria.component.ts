import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Coordenadoria } from '../../../../models/Coordenadoria';
import { ModalDialogComponent } from '../../../modal-dialog/modal-dialog.component';
import { CoordenadoriaService } from '../service/coordenadoria.service';
import { ModalDialogOkComponent } from '../../../modal-dialog/modal-dialog-ok/modal-dialog-ok.component';

@Component({
  selector: 'app-cadastro-coordenadoria',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatTableModule
  ],
  templateUrl: './cadastro-coordenadoria.component.html',
  styleUrl: './cadastro-coordenadoria.component.css'
})
export class CadastroCoordenadoriaComponent implements OnInit {

  coordenadorias: Coordenadoria[] = [];
  form: FormGroup;
  mensagemSnackbarAcerto: string = 'Coordenadoria cadastrada com sucesso.';
  mensagemSnackbarErro: string = 'Erro ao cadastrar coordenadoria.';

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private service: CoordenadoriaService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  )

  {
    this.form = this.formBuilder.group({
      id: [0],
      name: ['', Validators.required],
      acronym: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const obj: Coordenadoria = this.route.snapshot.data['coordenadoria'];
    if (obj) {
      this.form.setValue({
        id: obj._id,
        name: obj.name,
        acronym: obj.acronym,
        description: obj.description
      });
    }
  }

  onSubmit() {
    if (this.form.valid) {
      let name = this.form.get('name')?.value;
      name = name.toLowerCase();
      let acronym = this.form.get('acronym')?.value;
      acronym = acronym.toLowerCase();
 
      this.service.listar().subscribe(coordenadorias => { 
        this.coordenadorias = coordenadorias;

        const duplicateName = this.coordenadorias.some(coordenadoria => coordenadoria.name.toLowerCase() === name);
        const duplicateAcronym = this.coordenadorias.some(coordenadoria => coordenadoria.acronym.toLowerCase() === acronym);

        if (duplicateName || duplicateAcronym) {
          const dialogData = {
            title: 'Erro ao Cadastrar',
            message: 'Já existe um registro com o mesmo nome ou sigla.'
          };
          this.dialog.open(ModalDialogOkComponent, {
            data: dialogData,
            backdropClass: 'backdrop'
          });
        } else {
          this.save();
        }
      });
    } else {
      const missingFields = [];
      if (this.form.get('name')?.hasError('required')) {
        missingFields.push('<li>Nome</li>');
      }
      if (this.form.get('acronym')?.hasError('required')) {
        missingFields.push('<li>Sigla (pelo menos 3 caracteres)</li>');
      } else if (this.form.get('acronym')?.value.length < 3) {
        missingFields.push('<li>Sigla (pelo menos 3 caracteres)</li>');
      }
      if (this.form.get('description')?.hasError('required')) {
        missingFields.push('<li>Descrição (pelo menos 3 caracteres)</li>');
      } else if (this.form.get('description')?.value.length < 3) {
        missingFields.push('<li>Descrição (pelo menos 3 caracteres)</li>');
      }
      const dialogDataForm = {
        title: 'Erro ao Cadastrar',
        message: `É necessário que os seguintes campos sejam preenchidos: ${missingFields.join('')}`,
      };

      this.dialog.open(ModalDialogOkComponent, {
        data: dialogDataForm,
        backdropClass: 'backdrop'
      });
    }
  }

  private save() {
    this.service.save(this.form.value).subscribe(
      result => {
        const dialogData = {
          title: 'Coordenadoria Cadastrada',
          message: `A coordenadoria ${result.name} foi cadastrada.`,
          buttons: {
            cadastrarNovo: 'Cadastrar Nova Coordenadoria',
            irParaGerencia: 'Ver Coordenadorias Cadastradas'
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
        this.form.get('acronym')?.setValue('');
        this.form.get('description')?.setValue('');
      } else {
        this.router.navigate(['/cadastro-gerencia/gerencia-coordenadoria']);
      }
    });
  }

  formVerify() {

  }

}


