import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cadastro-coordenador',
  standalone: true,
  imports: [],
  templateUrl: './cadastro-coordenador.component.html',
  styleUrl: './cadastro-coordenador.component.css'
})
export class CadastroCoordenadorComponent {

  constructor(
    private router: Router
    ) {}

  cancelar() {
    if (confirm('Tem certeza que deseja cancelar?')) {
      this.router.navigate(['/cadastro-gerencia']);
    }
  }

}
