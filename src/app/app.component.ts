// app.component.ts
import { Component, OnInit, Renderer2 } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { CadastroDisciplinaComponent } from './components/cadastro-gerencia/disciplina/cadastro-disciplina/cadastro-disciplina.component';
import { CadastroCoordenadorComponent } from './components/cadastro-gerencia/coordenador/cadastro-coordenador/cadastro-coordenador.component';
import { CadastroTurmaComponent } from './components/cadastro-gerencia/turma/cadastro-turma/cadastro-turma.component';
import { CadastroLocalComponent } from './components/cadastro-gerencia/local/cadastro-local/cadastro-local.component';
import { MenuComponent } from './components/menu/menu.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { GuidePanelComponent } from './components/guide-panel/guide-panel.component';
import { CadastroGerenciaComponent } from './components/cadastro-gerencia/cadastro-gerencia-principal/cadastro-gerencia.component';
import { TelaLoginComponent } from './components/login/tela-login/tela-login.component';
import { PersonInfoComponent } from './components/schedules/person-info/person-info.component';
import { SharedService } from './shared-services/shared.service';
import { CommonModule } from '@angular/common';
import { AuthGuard } from './components/login/service/auth-guard.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MenuComponent,
    CadastroLocalComponent,
    CalendarComponent,
    GuidePanelComponent,
    CadastroGerenciaComponent,
    CadastroTurmaComponent,
    CadastroCoordenadorComponent,
    CadastroDisciplinaComponent,
    TelaLoginComponent,
    PersonInfoComponent,
    CommonModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'SIFES';
  selectedButton: number | null = null;
  showPersonInfo: boolean = false;
  private delayTimeout: any;
  isLoginPage: boolean = false;

  constructor(
    private sharedService: SharedService,
    private authComponent: AuthGuard,
    private router: Router,
    private renderer: Renderer2
  ) {
    this.sharedService.selectedButton$.subscribe(button => {
      this.selectedButton = button;
      if (this.selectedButton === 5) {
        clearTimeout(this.delayTimeout);
        this.delayTimeout = setTimeout(() => {
          this.showPersonInfo = true;
        }, 300);
      } else {
        this.showPersonInfo = false;
        const obj = { name: '', registration: '', type: '' };
        this.sharedService.setData(obj);
      }
    });

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isLoginPage = this.router.url === '/login';
      }
    });
  }

  getClasses() {
    return {
      'menu-selected': this.selectedButton === 5,
      'menu-not-selected': this.selectedButton !== 5
    };
  }

  ngOnInit() {
    this.showPersonInfo = false;

    const barcodeInput = this.renderer.selectRootElement('#barcodeInput', true);

    // Focar no campo de entrada oculto quando o componente for inicializado
    barcodeInput.focus();

    // Prevenir a combinação de teclas Ctrl + J (abrir aba de downloads no Chrome)
    this.renderer.listen('document', 'keydown', (event) => {
      if (event.ctrlKey && event.key === 'j') {
        event.preventDefault();
      }
    });

    // Capturar a entrada do código de barras
    this.renderer.listen(barcodeInput, 'keydown', (event) => {
      // Prevenir o comportamento padrão do navegador
      event.preventDefault();

      // Capturar o valor digitado
      if (event.key === 'Enter') {
        const barcodeValue = barcodeInput.value;
        console.log('Código de barras lido:', barcodeValue);
        barcodeInput.value = ''; // Limpar o campo de entrada

        // Adicione sua lógica aqui para processar o código de barras
        // Por exemplo, buscar o aluno correspondente e imprimir as etiquetas

        // Refoque no campo de entrada oculto após o processamento
        barcodeInput.focus();
      }
    });

    // Simular o evento Enter manualmente após a leitura do código de barras
    this.renderer.listen(barcodeInput, 'input', (event) => {
      if (barcodeInput.value && barcodeInput.value.endsWith('Enter')) {
        const barcodeValue = barcodeInput.value.slice(0, -5); // Remover 'Enter'
        console.log('Código de barras lido:', barcodeValue);
        barcodeInput.value = ''; // Limpar o campo de entrada

        // Adicione sua lógica aqui para processar o código de barras
        // Por exemplo, buscar o aluno correspondente e imprimir as etiquetas

        // Refoque no campo de entrada oculto após o processamento
        barcodeInput.focus();
      }
    });
  }
}
