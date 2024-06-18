import { CadastroAlunoComponent } from './components/cadastro-gerencia/aluno/cadastro-aluno/cadastro-aluno.component';
import { CadastroDisciplinaComponent } from './components/cadastro-gerencia/disciplina/cadastro-disciplina/cadastro-disciplina.component';
import { CadastroCoordenadorComponent } from './components/cadastro-gerencia/coordenador/cadastro-coordenador/cadastro-coordenador.component';
import { CadastroTurmaComponent } from './components/cadastro-gerencia/turma/cadastro-turma/cadastro-turma.component';
import { CadastroLocalComponent } from './components/cadastro-gerencia/local/cadastro-local/cadastro-local.component';
import { Component, OnInit} from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { MenuComponent } from './components/menu/menu.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { GuidePanelComponent } from './components/guide-panel/guide-panel.component';
import { CadastroGerenciaComponent } from './components/cadastro-gerencia/cadastro-gerencia-principal/cadastro-gerencia.component';
import { TelaLoginComponent } from './components/login/tela-login/tela-login.component';
import { PersonInfoComponent } from './components/schedules/person-info/person-info.component';
import { SharedService } from './shared-services/shared.service';
import { CommonModule } from '@angular/common';
import { AuthGuard } from './components/login/service/auth-guard.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,
            MenuComponent,
            CadastroLocalComponent,
            CalendarComponent,
            GuidePanelComponent,
            CadastroGerenciaComponent,
            CadastroTurmaComponent,
            CadastroCoordenadorComponent,
            CadastroDisciplinaComponent,
            CadastroAlunoComponent,
            TelaLoginComponent,
            PersonInfoComponent,
            CommonModule
          ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  selectedButton: number | null = null;
  showPersonInfo: boolean = false;
  private delayTimeout: any;

  constructor(
    private sharedService: SharedService,
    private authComponent: AuthGuard
    
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
        this.sharedService.setData(obj)
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
  }
}


