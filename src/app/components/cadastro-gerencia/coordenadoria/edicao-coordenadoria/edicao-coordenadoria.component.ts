import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { CoordenadoriaService } from '../service/coordenadoria.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReloadService } from '../../../../shared-services/reload.service';
import { Coordenadoria } from '../../../../models/Coordenadoria';
import { ModalDialogOkComponent } from '../../../modal-dialog/modal-dialog-ok/modal-dialog-ok.component';

@Component({
  selector: 'app-edicao-coordenadoria',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatIcon
  ],
  templateUrl: './edicao-coordenadoria.component.html',
  styleUrl: './edicao-coordenadoria.component.css'
})
export class EdicaoCoordenadoriaComponent implements OnInit {

  coordenadorias: Coordenadoria[] = [];
  form: FormGroup;
  mensagemSnackbarAcerto: string = 'Coordenadoria editada com sucesso.';
  mensagemSnackbarErro: string = 'Erro ao editar coordenadoria.';

  constructor(
    public dialogRef: MatDialogRef<EdicaoCoordenadoriaComponent>,
    private formBuilder: FormBuilder,
    private service: CoordenadoriaService,
    private snackBar: MatSnackBar,
    private reloadService: ReloadService,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
  )

  {
    this.form = this.formBuilder.group({
      _id: [0],
      name: ['', Validators.required],
      acronym: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const obj: Coordenadoria = this.data.coordenadoria;
    if (obj) {
      this.form.setValue({
        _id: obj._id,
        name: obj.name,
        acronym: obj.acronym,
        description: obj.description
      });
    }
  }

  onSubmit() {
    if (this.form.valid) {
      const name = this.form.get('name')?.value;
      const acronym = this.form.get('acronym')?.value;

      this.service.listar().subscribe(coordenadorias => {
        this.coordenadorias = coordenadorias;

        const duplicateName = this.coordenadorias.some(coordenadoria => coordenadoria.name === name);
        const duplicateAcronym = this.coordenadorias.some(coordenadoria => coordenadoria.acronym === acronym);

        if (duplicateName || duplicateAcronym) {
          const dialogData = {
            title: 'Erro ao Cadastrar',
            message: 'Já existe um registro com o mesmo nome ou sigla.'
          };
          this.dialog.open(ModalDialogOkComponent, {
            data: dialogData,
            backdropClass: 'backdropTwo'
          });
        } else {
          this.saveCoordenadoria();
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
        backdropClass: 'backdropTwo'
      });
    }
  }

  private saveCoordenadoria() {
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
