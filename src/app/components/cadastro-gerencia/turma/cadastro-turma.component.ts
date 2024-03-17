import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cadastro-turma',
  standalone: true,
  imports: [],
  templateUrl: './cadastro-turma.component.html',
  styleUrl: './cadastro-turma.component.css'
})
export class CadastroTurmaComponent {

  constructor(
    private router: Router
    ) {}

  cancelar() {
    if (confirm('Tem certeza que deseja cancelar?')) {
      this.router.navigate(['/cadastro-gerencia']);
    }
  }

}
