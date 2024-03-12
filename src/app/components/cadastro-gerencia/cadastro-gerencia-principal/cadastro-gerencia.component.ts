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
  cadastroButtonTop: number | undefined;
  gerenciarButtonTop: number | undefined;
  cadastroButtonLeft: number | undefined;
  gerenciarButtonLeft: number | undefined;

  @ViewChild('subMenuOptionsCadastro') subMenuOptionsCadastro: ElementRef | undefined;
  @ViewChild('subMenuOptionsGerenciar') subMenuOptionsGerenciar: ElementRef | undefined;
  @ViewChild('cadastroButton') cadastroButton: ElementRef | undefined;
  @ViewChild('gerenciarButton') gerenciarButton: ElementRef | undefined;

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

    // const zIndexButton = 998;
    // const zIndexSubMenu = 999;
    // const activeButtonZIndex = 1001;

    // if (tipo === 'cadastro' && this.cadastroButton) {
    //   this.cadastroButton.nativeElement.style.zIndex = this.subMenuOpenCadastro ? activeButtonZIndex : zIndexButton;
    //   if (this.subMenuOptionsCadastro) {
    //     this.subMenuOptionsCadastro.nativeElement.style.zIndex = this.subMenuOpenCadastro ? zIndexSubMenu : 0;
    //   }
    // } else if (tipo === 'gerenciar' && this.gerenciarButton) {
    //   this.gerenciarButton.nativeElement.style.zIndex = this.subMenuOpenGerenciar ? activeButtonZIndex : zIndexButton;
    //   if (this.subMenuOptionsGerenciar) {
    //     this.subMenuOptionsGerenciar.nativeElement.style.zIndex = this.subMenuOpenGerenciar ? zIndexSubMenu : 0;
    //   }
    // }

    // const backdropZIndex = (this.subMenuOpenCadastro || this.subMenuOpenGerenciar) ? 997 : 0;
    // document.querySelector('.backdrop')?.setAttribute('style', `z-index: ${backdropZIndex}`);
  }

  setButtonTopPosition(buttonType: string, button: HTMLButtonElement) {
    const buttonRect = button.getBoundingClientRect();
    if (buttonType === 'cadastro') {
      this.cadastroButtonTop = buttonRect.bottom + 10;
      this.cadastroButtonLeft = buttonRect.left;
    } else if (buttonType === 'gerenciar') {
      this.gerenciarButtonTop = buttonRect.bottom + 10;
      this.gerenciarButtonLeft = buttonRect.left;
    }
  }

  constructor() {}
}
