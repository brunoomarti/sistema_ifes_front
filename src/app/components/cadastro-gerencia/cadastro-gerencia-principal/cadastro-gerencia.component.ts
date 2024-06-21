import { CommonModule } from '@angular/common';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-cadastro-gerencia',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './cadastro-gerencia.component.html',
  styleUrls: ['./cadastro-gerencia.component.css']
})
export class CadastroGerenciaComponent {

  constructor(private router: Router) {}

  subMenuOpenCadastro: boolean = false;
  subMenuOpenGerenciar: boolean = false;

  @ViewChild('subMenuOptionsCadastro') subMenuOptionsCadastro: ElementRef | undefined;
  @ViewChild('subMenuOptionsGerenciar') subMenuOptionsGerenciar: ElementRef | undefined;

  changeZIndex(element: ElementRef, zIndexValue: number) {
    if (element && element.nativeElement) {
      element.nativeElement.style.zIndex = zIndexValue.toString();
    }
  }

  toggleSubMenu(tipo: string) {
    if (tipo === 'cadastro') {
      this.subMenuOpenCadastro = !this.subMenuOpenCadastro;
      if (this.subMenuOptionsCadastro) {
        this.subMenuOptionsCadastro.nativeElement.classList.toggle("active");
        this.changeZIndex(this.subMenuOptionsCadastro, 1000);
      }
      this.subMenuOpenGerenciar = false;
    }

    if (tipo === 'gerenciar') {
      this.subMenuOpenGerenciar = !this.subMenuOpenGerenciar;
      if (this.subMenuOptionsGerenciar) {
        this.subMenuOptionsGerenciar.nativeElement.classList.toggle("active");
        this.changeZIndex(this.subMenuOptionsGerenciar, 1000);
      }
      this.subMenuOpenCadastro = false;
    }

    if (tipo === 'fechar') {
      this.subMenuOpenCadastro = false;
      this.subMenuOpenGerenciar = false;
    }
  }

  navigateToCadastroTurma() {
    this.router.navigate(['/cadastro-local']);
  }
}
