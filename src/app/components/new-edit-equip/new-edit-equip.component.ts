import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Equipamento } from '../../models/Equipamento';
import { ActivatedRoute } from '@angular/router';
import { EquipamentoService } from '../../../service/equipamento.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-new-edit-equip',
  templateUrl: './new-edit-equip.component.html',
  styleUrls: ['./new-edit-equip.component.css']
})
export class NewEditEquipComponent implements OnInit {
  form: FormGroup;
  mensagemSnackbarAcerto: string = 'Titulo cadastrado com sucesso.';
  mensagemSnackbarErro: string = 'Erro ao cadastrar titulo.';

  constructor(
    public dialogRef: MatDialogRef<NewEditEquipComponent>,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private equipamentoService: EquipamentoService
  ) {
    this.form = this.formBuilder.group({
      _id: [0],
      nome: ''
    });
  }

  ngOnInit(): void {
    const equipamento: Equipamento = this.route.snapshot.data['equipment'];
    this.form.setValue({
      _id: equipamento._id,
      nome: equipamento.nome
    });
  }

  onSubmit() {
    console.log(this.form);
    this.equipamentoService.save(this.form.value).subscribe(
      result => this.onSucess(),
      error => this.onFailed()
    );
  }

  onCancel(): void {
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
      // Lógica para excluir o equipamento
    }
  }

  onFailed() {
    this.snackBar.open(this.mensagemSnackbarErro, '', { duration: 5000, panelClass: ['errorSnackbar'] });
  }

  onSucess() {
    this.snackBar.open(this.mensagemSnackbarAcerto, '', { duration: 5000, panelClass: ['successSnackbar'] });
    this.dialogRef.close();
  }
}
