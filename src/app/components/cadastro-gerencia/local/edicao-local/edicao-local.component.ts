import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { LocalService } from '../service/local.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReloadService } from '../../../../shared-services/reload.service';
import { Local } from '../../../../models/Local';
import { Equipamento } from '../../../../models/Equipamento';
import { EquipmentService } from '../../../new-edit-equip/services/new-edit-equip.service';
import { NewEditEquipComponent } from '../../../new-edit-equip/component/new-edit-equip.component';
import { EquipamentoLocal } from '../../../../models/EquipamentoLocal';
import { ModalDialogOkComponent } from '../../../modal-dialog/modal-dialog-ok/modal-dialog-ok.component';

@Component({
  selector: 'app-edicao-local',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatIcon
  ],
  templateUrl: './edicao-local.component.html',
  styleUrl: './edicao-local.component.css'
})
export class EdicaoLocalComponent implements OnInit {

  form: FormGroup;
  equipamentos: Equipamento[] = [];
  itensInseridos: EquipamentoLocal[] = [];
  novoItem: { equipamento: Equipamento | undefined, quantidade: number } = { equipamento: undefined, quantidade: 0 };

  mensagemSnackbarAcerto: string = 'Local editado com sucesso.';
  mensagemSnackbarErro: string = 'Erro ao editar local.';

  constructor(
    public dialogRef: MatDialogRef<EdicaoLocalComponent>,
    private formBuilder: FormBuilder,
    private service: LocalService,
    private equipmentService: EquipmentService,
    private snackBar: MatSnackBar,
    private reloadService: ReloadService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
  )

  {
    this.form = this.formBuilder.group({
      _id: [0],
      name: ['', Validators.required],
      capacity: ['', Validators.required],
      equipments: null,
      amount: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const obj: Local = this.data.local;
    if (obj) {
      this.form.setValue({
        _id: obj._id,
        name: obj.name,
        capacity: obj.capacity,
        equipments: obj.equipments,
        amount: null
      });

      if (obj.equipments && obj.equipments.length > 0) {
        this.itensInseridos = obj.equipments;
      }
    }

    this.equipmentService.listar().subscribe(equipamentos => this.equipamentos = equipamentos);

    this.reloadService.reload$.subscribe(() => {
      this.equipmentService.listar().subscribe(equipamentos => this.equipamentos = equipamentos);
    });
  }

  novoEquipamento(): void {
    const dialogRef = this.dialog.open(NewEditEquipComponent, {
      disableClose: true,
      backdropClass: 'backdrop',
    });
  }

  inserirEquipamento() {
    const equipamentoIndex: number = this.form.get('equipments')?.value;
    const quantidade: number = this.form.get('amount')?.value;

    const equipamentoSelecionado: Equipamento | undefined = this.equipamentos[equipamentoIndex];

    console.log(equipamentoSelecionado);

    if (equipamentoSelecionado && quantidade > 0) {
      console.log(quantidade);
      const itemExistente = this.itensInseridos.find(item => item.equipment === equipamentoSelecionado);

      if (itemExistente) {
        itemExistente.quantity += quantidade;
      } else {
        this.itensInseridos.push({ _id: 0, equipment: equipamentoSelecionado, quantity: quantidade });
      }

      this.novoItem = { equipamento: undefined, quantidade: 0 };
    } else {
      alert('Por favor, selecione um equipamento e insira uma quantidade válida.');
    }
  }

  excluirItemDaLista(index: number) {
    this.itensInseridos.splice(index, 1);
  }

  onSubmit() {
    this.form.patchValue({ equipments: this.itensInseridos });
    console.log(this.form.value);
    if (this.form.valid){
      this.service.save(this.form.value).subscribe(result => this.onSucess(), error => this.onFailed());
    
    } else {
      const missingFields = [];
      if (this.form.get('name')?.hasError('required')) {
        missingFields.push('<li>Nome</li>');
      } else if (this.form.get('name')?.value.length > 10) {
        missingFields.push('<li>O nome do local deve ter no máximo 10 caracteres</li>'); 
      }

      if (this.form.get('capacity')?.hasError('required')) {
        missingFields.push('<li>Capacidade</li>');
      } else if (this.form.get('capacity')?.value < 0) {
        missingFields.push('<li>Selecione um Capacidade maior que zero</li>');
      } 

      if (this.form.get('equipments')?.hasError('required')) {
        missingFields.push('<li>Equipamento Disponível</li>');
      } else if (this.form.get('equipments')?.value.length < 0) {
        missingFields.push('<li>Selecione no mínimo UM Equipamento</li>');
      }

      if (this.form.get('amount')?.hasError('required')) {
        missingFields.push('<li>Quantidade</li>');
      } else if (this.form.get('amount')?.value < 0) {
        missingFields.push('<li>Selecione um Quantidade maior que zero</li>');
      } 

      const dialogDataForm = {
        title: 'Erro ao Salvar',
        message: `É necessário que os seguintes campos sejam preenchidos: ${missingFields.join('')}`,
      };

      this.dialog.open(ModalDialogOkComponent, {
        data: dialogDataForm,
        backdropClass: 'backdrop'
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSucess() {
    this.snackBar.open(this.mensagemSnackbarAcerto, '', { duration: 5000, panelClass: ['successSnackbar'] });
    this.reloadService.triggerReload();
    this.dialogRef.close();
  }

  onFailed() {
    this.snackBar.open(this.mensagemSnackbarErro, '', { duration: 5000, panelClass: ['errorSnackbar'] });
    this.dialogRef.close();
  }

}
