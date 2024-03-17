import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { TurmaService } from '../service/turma.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Turma } from '../../../../models/Turma';

@Component({
  selector: 'app-cadastro-turma',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatTableModule
  ],
  templateUrl: './cadastro-turma.component.html',
  styleUrl: './cadastro-turma.component.css'
})
export class CadastroTurmaComponent implements OnInit {

  form: FormGroup;
  mensagemSnackbarAcerto: string = 'Turma cadastrada com sucesso.';
  mensagemSnackbarErro: string = 'Erro ao cadastrar turma.';

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private service: TurmaService,
    private snackBar: MatSnackBar,
  )

  {
    this.form = this.formBuilder.group({
      _id: [0],
      name: ''
    });
  }

  ngOnInit(): void {
    const obj: Turma = this.route.snapshot.data['turma'];
    if (obj) {
      this.form.setValue({
        _id: obj._id,
        name: obj.name
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
