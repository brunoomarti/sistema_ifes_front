import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-guide-panel',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './guide-panel.component.html',
  styleUrls: ['./guide-panel.component.css']
})
export class GuidePanelComponent {

  userName: string | null = '';
  mainTitle: string = 'Olá, ';
  subTitle: string = 'O que deseja fazer hoje?';
  newMainTitle: string = '';
  newSubTitle: string = '';
  fadingOut: boolean = false;
  fadingInPrimary: boolean = false;
  fadingInSecondary: boolean = false;
  showSecondary: boolean = false;
  lastRelevantPath: string = '';

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    if (typeof localStorage !== 'undefined'){
      this.userName = localStorage.getItem('username');
    }
    this.mainTitle += this.userName;

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const relevantPath = this.getRelevantPath(this.activatedRoute.root);
        console.log(`Relevant Path: ${relevantPath}, Last Relevant Path: ${this.lastRelevantPath}`); // Debugging line
        if (relevantPath !== this.lastRelevantPath) {
          this.lastRelevantPath = relevantPath;
          this.updateTitles(relevantPath);
          this.triggerAnimation();
        }
      }
    });
  }

  triggerAnimation() {
    this.fadingOut = true;
    setTimeout(() => {
      this.fadingInSecondary = true;
      this.showSecondary = true;
    }, 200); // Ajuste o tempo para quando a animação de entrada deve começar
    setTimeout(() => {
      this.fadingOut = false;
      this.fadingInSecondary = false;
      this.showSecondary = false;
      this.fadingInPrimary = true;
      this.mainTitle = this.newMainTitle;
      this.subTitle = this.newSubTitle;
      setTimeout(() => {
        this.fadingInPrimary = false;
      }, 400); // Duração da animação de entrada
    }, 600); // Duração total das animações (400ms + 200ms)
  }

  getRelevantPath(route: ActivatedRoute): string {
    while (route.firstChild) {
      route = route.firstChild;
    }
    // Extraindo a primeira parte do caminho
    const fullPath = route.snapshot.url.map(segment => segment.path).join('/');
    const relevantPath = fullPath.split('/')[0];
    return relevantPath;
  }

  updateTitles(relevantPath: string) {
    if (relevantPath === 'cadastro-gerencia') {
      this.newMainTitle = 'Gerenciamento e cadastro';
      this.newSubTitle = 'Cadastre e gerencie usuários. Configure também a estrutura acadêmica.';
    } else if (relevantPath === 'importar-dados') {
      this.newMainTitle = 'Importação de dados';
      this.newSubTitle = 'Espaço para importação de dados.';
    } else if (relevantPath === 'alocar-local') {
      this.newMainTitle = 'Alocações';
      this.newSubTitle = 'Aloque aulas e eventos.';
    } else if (relevantPath === 'horarios') {
      this.newMainTitle = 'Consultar horário';
      this.newSubTitle = 'Fique por dentro dos horários de aula.';
    } else {
      this.newMainTitle = `Olá, ${this.userName}`;
      this.newSubTitle = 'O que deseja fazer hoje?';
    }
  }
}
