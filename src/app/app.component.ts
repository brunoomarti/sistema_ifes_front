import { Component} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuComponent } from './components/menu/menu.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { GuidePanelComponent } from './components/guide-panel/guide-panel.component';
import { CadastroLocalComponent } from './components/cadastro-gerencia/cadastro-local/cadastro-local.component';
import { CadastroGerenciaComponent } from './components/cadastro-gerencia/cadastro-gerencia-principal/cadastro-gerencia.component';
import { CadastroTurmaComponent } from './components/cadastro-gerencia/cadastro-turma/cadastro-turma.component';
import { CadastroCoordenadorComponent } from './components/cadastro-gerencia/cadastro-coordenador/cadastro-coordenador.component';
import { CadastroDisciplinaComponent } from './components/cadastro-gerencia/cadastro-disciplina/cadastro-disciplina.component';
import { CadastroAlunoComponent } from './components/cadastro-gerencia/cadastro-aluno/cadastro-aluno.component';


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


