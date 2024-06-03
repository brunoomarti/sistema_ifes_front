import { LocalService } from './../service/local.service';
import { Equipamento } from '../../../../models/Equipamento';
import { Component, OnInit } from '@angular/core';
import { NewEditEquipComponent } from '../../../new-edit-equip/component/new-edit-equip.component';
import { MatDialog } from '@angular/material/dialog';
import { EquipmentService } from '../../../new-edit-equip/services/new-edit-equip.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule, NgFor } from '@angular/common';
import { ReloadService } from '../../../../shared-services/reload.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { Local } from '../../../../models/Local';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ModalDialogComponent } from '../../../modal-dialog/modal-dialog.component';
import { EquipamentoLocal } from '../../../../models/EquipamentoLocal';
import { ModalDialogOkComponent } from '../../../modal-dialog/modal-dialog-ok/modal-dialog-ok.component';

@Component({
  selector: 'app-cadastro-local',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgFor,
    CommonModule,
    MatTableModule
  ],
  templateUrl: './cadastro-local.component.html',
  styleUrl: './cadastro-local.component.css'
})
export class CadastroLocalComponent implements OnInit {

  form: FormGroup;
  equipamentos: Equipamento[] = [];
  itensInseridos: EquipamentoLocal[] = [];
  novoItem: { equipamento: Equipamento | undefined, quantidade: number } = { equipamento: undefined, quantidade: 0 };

  mensagemSnackbarAcerto: string = 'Local cadastrado com sucesso.';
  mensagemSnackbarErro: string = 'Erro ao cadastrar local.';

  constructor(public dialog: MatDialog,
              private formBuilder: FormBuilder,
              private equipmentService: EquipmentService,
              private localService: LocalService,
              private reloadService: ReloadService,
              private router: Router,
              private snackBar: MatSnackBar,
              private route: ActivatedRoute,
              )

              {
                this.form = this.formBuilder.group({
                  id: [0],
                  name: ['', Validators.required],
                  capacity: ['', Validators.required],
                  equipments: null,
                  amount: ['', Validators.required]
                });
              }

  ngOnInit(): void {
    const obj: Local = this.route.snapshot.data['local'];
    if (obj) {
      this.form.setValue({
        id: obj._id,
        name: obj.name,
        capacity: obj.capacity,
        equipments: obj.equipments
      });
    }

    this.equipmentService.listar().subscribe(equipamentos => this.equipamentos = equipamentos);

    this.reloadService.reload$.subscribe(() => {
      this.equipmentService.listar().subscribe(equipamentos => this.equipamentos = equipamentos);
    });

    console.log(this.form.value)
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
    if (this.form.valid){
    this.form.patchValue({ equipments: this.itensInseridos }); 
      this.localService.save(this.form.value).subscribe(
        result => {
          const dialogData = {
            title: 'Local Cadastrado',
            message: `O local ${result.name} foi cadastrado.`,
            buttons: {
              cadastrarNovo: 'Cadastrar Novo Local',
              irParaGerencia: 'Ver Locais Cadastrados'
            }
          };
          this.openDialog(dialogData);
        },
        error => {
          this.onFailed();
        }
      );
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
        title: 'Erro ao Cadastrar',
        message: `É necessário que os seguintes campos sejam preenchidos: ${missingFields.join('')}`,
      };

      this.dialog.open(ModalDialogOkComponent, {
        data: dialogDataForm,
        backdropClass: 'backdrop'
      });
    }
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
        this.form.get('capacity')?.setValue('');
        this.form.get('equipment')?.setValue('');
        this.form.get('amount')?.setValue('');
        this.itensInseridos = [];
      } else {
        this.router.navigate(['/cadastro-gerencia/gerencia-local']);
      }
    });
  }

}
