import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Coordenadoria } from '../../../../models/Coordenadoria';
import { ModalDialogComponent } from '../../../modal-dialog/modal-dialog.component';
import { CoordenadoriaService } from '../service/coordenadoria.service';

@Component({
  selector: 'app-cadastro-coordenadoria',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatTableModule
  ],
  templateUrl: './cadastro-coordenadoria.component.html',
  styleUrl: './cadastro-coordenadoria.component.css'
})
export class CadastroCoordenadoriaComponent implements OnInit {

  form: FormGroup;
  mensagemSnackbarAcerto: string = 'Coordenadoria cadastrada com sucesso.';
  mensagemSnackbarErro: string = 'Erro ao cadastrar coordenadoria.';

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private service: CoordenadoriaService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  )

  {
    this.form = this.formBuilder.group({
      id: [0],
      name: [''],
      acronym: [''],
      description: ['']
    });
  }

  ngOnInit(): void {
    const obj: Coordenadoria = this.route.snapshot.data['coordenadoria'];
    if (obj) {
      this.form.setValue({
        id: obj._id,
        name: obj.name,
        acronym: obj.acronym,
        description: obj.description
      });
    }
  }

  onSubmit() {
    this.service.save(this.form.value).subscribe(
      result => {
        const dialogData = {
          title: 'Coordenadoria Cadastrada',
          message: `A coordenadoria ${result.name} foi cadastrada.`,
          buttons: {
            cadastrarNovo: 'Cadastrar Nova Coordenadoria',
            irParaGerencia: 'Ver Coordenadorias Cadastradas'
          }
        };
        this.openDialog(dialogData);
      },
      error => {
        this.onFailed();
      }
    );
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
        this.form.get('acronym')?.setValue('');
        this.form.get('description')?.setValue('');
      } else {
        this.router.navigate(['/cadastro-gerencia/gerencia-coordenadoria']);
      }
    });
  }

}
