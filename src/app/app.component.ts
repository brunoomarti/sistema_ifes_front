import { CadastroAlunoComponent } from './components/cadastro-gerencia/aluno/cadastro-aluno.component';
import { CadastroDisciplinaComponent } from './components/cadastro-gerencia/disciplina/cadastro-disciplina.component';
import { CadastroCoordenadorComponent } from './components/cadastro-gerencia/coordenador/cadastro-coordenador/cadastro-coordenador.component';
import { CadastroTurmaComponent } from './components/cadastro-gerencia/turma/cadastro-turma.component';
import { CadastroLocalComponent } from './components/cadastro-gerencia/local/cadastro-local.component';
import { Component} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuComponent } from './components/menu/menu.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { GuidePanelComponent } from './components/guide-panel/guide-panel.component';
import { CadastroGerenciaComponent } from './components/cadastro-gerencia/cadastro-gerencia-principal/cadastro-gerencia.component';

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
            CadastroAlunoComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'sistema_ifes_front';
}


