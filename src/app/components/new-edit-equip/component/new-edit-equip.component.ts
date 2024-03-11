import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { EquipmentService } from '../services/new-edit-equip.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Equipamento } from '../../../models/Equipamento';

@Component({
  selector: 'app-new-edit-equip',
  templateUrl: './new-edit-equip.component.html',
  styleUrls: ['./new-edit-equip.component.css']
})
export class NewEditEquipComponent implements OnInit {

  form: FormGroup;
  equipamentos: any[] = [];

  mensagemSnackbarAcerto: string = 'Titulo cadastrado com sucesso.';
  mensagemSnackbarErro: string = 'Erro ao cadastrar titulo.';

  constructor(public dialogRef: MatDialogRef<NewEditEquipComponent>,
              private formBuilder: FormBuilder,
              private service: EquipmentService,
              private snackBar: MatSnackBar,
              private route: ActivatedRoute,
    )

    {

    }

    ngOnInit(): void {

      this.form = this.formBuilder.group({
        id: [null],
        name: [null]
      });

      const equip: Equipamento = this.route.snapshot.data['equipment'];
      // this.form.setValue({
      //   id: equip._id,
      //   name: equip.name
      // })
    }

  onSubmit() {
    console.log(this.form.value);
    this.service.save(this.form.value);//.subscribe(result => this.onSucess(), error => this.onFailed());
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  editar(equipamento: { name: string }): void {
    const novoNome = prompt('Digite o novo nome:', equipamento.name);
    if (novoNome !== null) {
      this.form.patchValue({ name: novoNome });
    }
  }

  excluir(equipamento: { name: string }): void {
    const confirmacao = confirm('Tem certeza que deseja excluir este equipamento?');
    if (confirmacao) {
      const index = this.equipamentos.indexOf(equipamento);
      this.equipamentos.splice(index, 1);
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
