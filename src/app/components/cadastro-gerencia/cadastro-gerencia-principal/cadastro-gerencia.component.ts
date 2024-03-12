import { CommonModule } from '@angular/common';
import { Component, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-cadastro-gerencia',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cadastro-gerencia.component.html',
  styleUrls: ['./cadastro-gerencia.component.css']
})
export class CadastroGerenciaComponent {

  subMenuOpenCadastro: boolean = false;
  subMenuOpenGerenciar: boolean = false;

  @ViewChild('subMenuOptionsCadastro') subMenuOptionsCadastro: ElementRef | undefined;
  @ViewChild('subMenuOptionsGerenciar') subMenuOptionsGerenciar: ElementRef | undefined;

  toggleSubMenu(tipo: string) {
    console.log("Botão clicado:", tipo);
    if (tipo === 'cadastro') {
      this.subMenuOpenCadastro = !this.subMenuOpenCadastro;
      if (this.subMenuOptionsCadastro) {
        this.subMenuOptionsCadastro.nativeElement.classList.toggle("active");
      }
      this.subMenuOpenGerenciar = false;
    } else if (tipo === 'gerenciar') {
      this.subMenuOpenGerenciar = !this.subMenuOpenGerenciar;
      if (this.subMenuOptionsGerenciar) {
        this.subMenuOptionsGerenciar.nativeElement.classList.toggle("active");
      }
      this.subMenuOpenCadastro = false;
    }
  }

  constructor() {}
}
