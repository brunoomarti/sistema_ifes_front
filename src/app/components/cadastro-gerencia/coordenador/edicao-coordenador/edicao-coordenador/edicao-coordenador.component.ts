import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { CoordenadorService } from '../../service/coordenador.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReloadService } from '../../../../../shared-services/reload.service';
import { Coordenador } from '../../../../../models/Coordenador';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CoordenadoriaService } from '../../../coordenadoria/service/coordenadoria.service';
import { Coordenadoria } from '../../../../../models/Coordenadoria';
import { ModalDialogOkComponent } from '../../../../modal-dialog/modal-dialog-ok/modal-dialog-ok.component';

@Component({
  selector: 'app-edicao-coordenador',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatIcon
  ],
  templateUrl: './edicao-coordenador.component.html',
  styleUrl: './edicao-coordenador.component.css'
})
export class EdicaoCoordenadorComponent implements OnInit {

  form: FormGroup;
  mensagemSnackbarAcerto: string = 'Coordenador editado com sucesso.';
  mensagemSnackbarErro: string = 'Erro ao editar coordenador.';
  coordenadorias: Coordenadoria[] = [];

  constructor(
    public dialogRef: MatDialogRef<EdicaoCoordenadorComponent>,
    private formBuilder: FormBuilder,
    private service: CoordenadorService,
    private coordinationService: CoordenadoriaService,
    private snackBar: MatSnackBar,
    private reloadService: ReloadService,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
  )

  {
    this.form = this.formBuilder.group({
      _id: 0,
      name: ['', [Validators.required, Validators.minLength(3)]],
      coordination: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.coordinationService.listar().subscribe(coordenadorias => {
      this.coordenadorias = coordenadorias;
    });

    const coord: Coordenador = this.data.coordenador;
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
      backdropClass: 'backdropTwo'
    });
  }

  save() {
    console.log(this.form.value);
    const selectedCoordination = this.coordenadorias.find(coord => coord._id == this.form.value.coordination);

    if (selectedCoordination) {
        this.form.patchValue({ coordination: selectedCoordination });
    }

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
