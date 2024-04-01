import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { CoordenadorService } from '../../service/coordenador.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { ReloadService } from '../../../../../shared-services/reload.service';
import { Coordenador } from '../../../../../models/Coordenador';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CoordenadoriaService } from '../../../coordenadoria/service/coordenadoria.service';
import { Coordenadoria } from '../../../../../models/Coordenadoria';

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
    @Inject(MAT_DIALOG_DATA) public data: any,
  )

  {
    this.form = this.formBuilder.group({
      _id: 0,
      name: '',
      coordination: ''
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
