import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-new-edit-equip',
  templateUrl: './new-edit-equip.component.html',
  styleUrls: ['./new-edit-equip.component.css']
})
export class NewEditEquipComponent implements OnInit {
  nomeEquipamento: string = '';
  equipamentos: any[] = [];

  constructor(public dialogRef: MatDialogRef<NewEditEquipComponent>) {}

  ngOnInit(): void {

  }

  cadastrar(): void {
    this.equipamentos.push({ nome: this.nomeEquipamento });
    this.nomeEquipamento = '';
  }

  cancelar(): void {
    this.dialogRef.close();
  }

  editar(equipamento: { nome: string }): void {
    const novoNome = prompt('Digite o novo nome:', equipamento.nome);
    if (novoNome !== null) {
      equipamento.nome = novoNome;
    }
  }

  excluir(equipamento: { nome: string }): void {
    const confirmacao = confirm('Tem certeza que deseja excluir este equipamento?');
    if (confirmacao) {
      const index = this.equipamentos.indexOf(equipamento);
      this.equipamentos.splice(index, 1);
    }
  }

}
