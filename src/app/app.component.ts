import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuComponent } from './components/menu/menu.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { GuidePanelComponent } from './components/guide-panel/guide-panel.component';
import { CadastroLocalComponent } from './components/cadastro-gerencia/cadastro-local/cadastro-local.component';
import { CadastroGerenciaComponent } from './components/cadastro-gerencia/cadastro-gerencia-principal/cadastro-gerencia.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,
            MenuComponent,
            CadastroLocalComponent,
            CalendarComponent,
            GuidePanelComponent,
            CadastroGerenciaComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'sistema_ifes_front';
}


