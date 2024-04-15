import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
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
      name: '',
      capacity: '',
      equipment: null,
      amount: 0
    });
  }

  ngOnInit(): void {
    const obj: Local = this.data.local;
    if (obj) {
      this.form.setValue({
        _id: obj._id,
        name: obj.name,
        capacity: obj.capacity,
        equipment: null,
        amount: 0
      });
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
    const equipamentoIndex: number = this.form.get('equipment')?.value;
    const quantidade: number = this.form.get('amount')?.value;

    const equipamentoSelecionado: Equipamento | undefined = this.equipamentos[equipamentoIndex];

    console.log(equipamentoSelecionado);

    if (equipamentoSelecionado && quantidade > 0) {
      const itemExistente = this.itensInseridos.find(item => item.equipment === equipamentoSelecionado);

      if (itemExistente) {
        itemExistente.quantity += quantidade;
      } else {
        this.itensInseridos.push({ _id : 0, equipment: equipamentoSelecionado, quantity: quantidade });
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
    console.log(this.form.value);
    this.service.save(this.form.value).subscribe(result => this.onSucess(), error => this.onFailed());
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
