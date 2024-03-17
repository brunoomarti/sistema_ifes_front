import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { EquipmentService } from '../services/new-edit-equip.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Equipamento } from '../../../models/Equipamento';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIcon } from '@angular/material/icon';
import { ReloadService } from '../../../shared-services/reload.service';


@Component({
  selector: 'app-new-edit-equip',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatTableModule,
    MatIcon
  ],
  templateUrl: './new-edit-equip.component.html',
  styleUrls: ['./new-edit-equip.component.css']
})
export class NewEditEquipComponent implements OnInit {

  readonly displayedColumns = ['name', 'actions'];

  form: FormGroup;
  equipamentos: any[] = [];

  mensagemSnackbarAcerto: string = 'Equipamento cadastrado com sucesso.';
  mensagemSnackbarErro: string = 'Erro ao cadastrar equipamento.';

  constructor(public dialogRef: MatDialogRef<NewEditEquipComponent>,
              private formBuilder: FormBuilder,
              private service: EquipmentService,
              private snackBar: MatSnackBar,
              private route: ActivatedRoute,
              private reloadService: ReloadService
    )

    {
      this.form = this.formBuilder.group({
        _id: [0],
        name: ''
      });
    }

  ngOnInit(): void {
      const equip: Equipamento = this.route.snapshot.data['equipamento'];
      if (equip) {
        this.form.setValue({
          _id: equip._id,
          name: equip.name
        });
      }

      this.service.listar().subscribe(equipamentos => this.equipamentos = equipamentos);

  }

  onSubmit() {
    console.log(this.form.value);
    this.service.save(this.form.value).subscribe(result => this.onSucess(false), error => this.onFailed());
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  editar(equipamento: { name: string }): void {
    const novoNome = prompt('Digite o novo nome:', equipamento.name);

    if (novoNome !== null) {
      this.form.patchValue({ name: novoNome });
      equipamento.name = novoNome;
      this.service.save(equipamento).subscribe(result => this.onSucess(), error => this.onFailed());
    }
  }

  excluir(equipamento: Equipamento): void {
    const confirmacao = confirm('Tem certeza que deseja excluir este equipamento?');
    if (confirmacao) {
      this.service.remove(equipamento._id).subscribe(() => {
        this.equipamentos = this.equipamentos.filter(e => e._id !== equipamento._id);
        this.onSucess(true);
      }, error => {
        console.error('Erro ao excluir equipamento:', error);
        this.onFailed();
      });
    }
  }


  onFailed() {
    this.snackBar.open(this.mensagemSnackbarErro, '', { duration: 5000, panelClass: ['errorSnackbar'] });
    this.dialogRef.close();
  }

  onSucess(excluirEquipamento: boolean = false) {
    if (excluirEquipamento) {
      this.snackBar.open('Equipamento excluído com sucesso', '', { duration: 5000, panelClass: ['successSnackbar'] });
    } else {
      this.snackBar.open(this.mensagemSnackbarAcerto, '', { duration: 5000, panelClass: ['successSnackbar'] });
    }
    this.reloadService.triggerReload();
    this.dialogRef.close();
  }


}
