import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Coordenador } from '../../../../models/Coordenador';
import { CoordenadorService } from '../service/coordenador.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-cadastro-coordenador',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatTableModule,
    MatIcon
  ],
  templateUrl: './cadastro-coordenador.component.html',
  styleUrl: './cadastro-coordenador.component.css'
})
export class CadastroCoordenadorComponent {

  form: FormGroup;
  mensagemSnackbarAcerto: string = 'Coordenador cadastrado com sucesso.';
  mensagemSnackbarErro: string = 'Erro ao cadastrar Coordenador.';

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private service: CoordenadorService,
    private snackBar: MatSnackBar,
  )

  {
    this.form = this.formBuilder.group({
      id: [0],
      name: '',
      shift: '',
    });
  }

  ngOnInit(): void {
    const coord: Coordenador = this.route.snapshot.data['coordenador'];
    if (coord) {
      this.form.setValue({
        id: coord._id,
        name: coord.name,
        shift: coord.shift
      });
    }
  }

  onSubmit() {
    console.log(this.form.value);
    this.service.save(this.form.value).subscribe(result => {
      this.onSucess();
      this.router.navigate(['/cadastro-gerencia']);
    }, error => this.onFailed());
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

}
