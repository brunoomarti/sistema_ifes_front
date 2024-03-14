import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cadastro-disciplina',
  standalone: true,
  imports: [],
  templateUrl: './cadastro-disciplina.component.html',
  styleUrl: './cadastro-disciplina.component.css'
})
export class CadastroDisciplinaComponent {

  constructor(
    private router: Router
    ) {}

  cancelar() {
    if (confirm('Tem certeza que deseja cancelar?')) {
      this.router.navigate(['/cadastro-gerencia']);
    }
  }

}
