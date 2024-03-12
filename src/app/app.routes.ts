import { RouterModule, Routes } from '@angular/router';
import { CadastroLocalComponent } from './components/cadastro-gerencia/cadastro-local/cadastro-local.component';
import { CadastroTurmaComponent } from './components/cadastro-gerencia/cadastro-turma/cadastro-turma.component';
import { CadastroCoordenadorComponent } from './components/cadastro-gerencia/cadastro-coordenador/cadastro-coordenador.component';
import { NgModule } from '@angular/core';

export const routes: Routes = [
  { path: 'cadastro-local', component: CadastroLocalComponent },
  { path: 'cadastro-turma', component: CadastroTurmaComponent },
  { path: 'cadastro-coordenador', component: CadastroCoordenadorComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRouting { }
