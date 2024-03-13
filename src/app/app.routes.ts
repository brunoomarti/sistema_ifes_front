import { RouterModule, Routes } from '@angular/router';
import { CadastroLocalComponent } from './components/cadastro-gerencia/cadastro-local/cadastro-local.component';
import { CadastroTurmaComponent } from './components/cadastro-gerencia/cadastro-turma/cadastro-turma.component';
import { CadastroCoordenadorComponent } from './components/cadastro-gerencia/cadastro-coordenador/cadastro-coordenador.component';
import { NgModule } from '@angular/core';
import { CadastroGerenciaComponent } from './components/cadastro-gerencia/cadastro-gerencia-principal/cadastro-gerencia.component';

export const routes: Routes = [
  { path: 'cadastro-gerencia', component: CadastroGerenciaComponent },
  { path: 'cadastro-local', 'title': 'SIFES | Cadastrar Local',component: CadastroLocalComponent },
  { path: 'cadastro-turma', 'title': 'SIFES | Cadastrar Turma',component: CadastroTurmaComponent },
  { path: 'cadastro-coordenador', 'title': 'SIFES | Cadastrar Coordenador',component: CadastroCoordenadorComponent },
  //{ path: '**',component: PageNotFoundComponent }, -- Caso queira criar uma pagina para NotFound
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRouting { }
