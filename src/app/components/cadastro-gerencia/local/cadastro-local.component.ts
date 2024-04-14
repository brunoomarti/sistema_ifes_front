import { Equipamento } from './../../../models/Equipamento';
import { Component, OnInit } from '@angular/core';
import { NewEditEquipComponent } from '../../new-edit-equip/component/new-edit-equip.component';
import { MatDialog } from '@angular/material/dialog';
import { EquipmentService } from '../../new-edit-equip/services/new-edit-equip.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, NgFor } from '@angular/common';
import { ReloadService } from '../../../shared-services/reload.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { Local } from '../../../models/Local';

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
  equipamentos: any[] = [];
  itensInseridos: { equipamento: Equipamento, quantidade: number }[] = [];
  novoItem: { equipamento: Equipamento | undefined, quantidade: number } = { equipamento: undefined, quantidade: 0 };

  mensagemSnackbarAcerto: string = 'Local cadastrado com sucesso.';
  mensagemSnackbarErro: string = 'Erro ao cadastrar local.';

  constructor(public dialog: MatDialog,
              private formBuilder: FormBuilder,
              private equipmentService: EquipmentService,
              // private locationService:
              private reloadService: ReloadService,
              private router: Router,
              private route: ActivatedRoute,
              )

              {
                this.form = this.formBuilder.group({
                  id: [0],
                  name: '',
                  capacity: '',
                  equipment: null,
                  amount: ''
                });
              }

  ngOnInit(): void {
    const obj: Local = this.route.snapshot.data['local'];
    if (obj) {
      this.form.setValue({
        id: obj._id,
        name: obj.name,
        capacity: obj.capacity,
        equipment: obj.equipment,
        amount: obj.amount
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
      const itemExistente = this.itensInseridos.find(item => item.equipamento === equipamentoSelecionado);

      if (itemExistente) {
        itemExistente.quantidade += quantidade;
      } else {
        this.itensInseridos.push({ equipamento: equipamentoSelecionado, quantidade: quantidade });
      }

      this.novoItem = { equipamento: undefined, quantidade: 0 };
    } else {
      alert('Por favor, selecione um equipamento e insira uma quantidade válida.');
    }
  }

  excluirItemDaLista(index: number) {
    this.itensInseridos.splice(index, 1);
  }


  // onSubmit() {
  //   this.service.save(this.form.value).subscribe(
  //     result => {
  //       const dialogData = {
  //         title: 'Aluno Cadastrado',
  //         message: `O aluno ${result.name} foi cadastrado.`,
  //         buttons: {
  //           cadastrarNovo: 'Cadastrar Novo Aluno',
  //           irParaGerencia: 'Ver Alunos Cadastrados'
  //         }
  //       };
  //       this.openDialog(dialogData);
  //     },
  //     error => {
  //       this.onFailed();
  //     }
  //   );
  // }

  onCancel() {
    if (confirm('Tem certeza que deseja cancelar?')) {
      this.router.navigate(['/cadastro-gerencia']);
    }
  }

}
