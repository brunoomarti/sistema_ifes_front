import { RouterModule, Routes } from '@angular/router';
import { CadastroLocalComponent } from './components/cadastro-gerencia/cadastro-local/cadastro-local.component';
import { CadastroTurmaComponent } from './components/cadastro-gerencia/cadastro-turma/cadastro-turma.component';
import { CadastroCoordenadorComponent } from './components/cadastro-gerencia/cadastro-coordenador/cadastro-coordenador.component';
import { NgModule } from '@angular/core';
import { CadastroGerenciaComponent } from './components/cadastro-gerencia/cadastro-gerencia-principal/cadastro-gerencia.component';
import { HomeComponent } from './components/home/home.component';
import { ImportDataComponent } from './components/import-data/import-data.component';
import { AllocateLocationComponent } from './components/allocate-location/allocate-location.component';
import { SchedulesComponent } from './components/schedules/schedules.component';
import { CadastroDisciplinaComponent } from './components/cadastro-gerencia/cadastro-disciplina/cadastro-disciplina.component';
import { CadastroAlunoComponent } from './components/cadastro-gerencia/cadastro-aluno/cadastro-aluno.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },

  { path: 'cadastro-gerencia', component: CadastroGerenciaComponent },
  { path: 'cadastro-gerencia/cadastro-local', data: { title: 'SIFES | Cadastrar Local' }, component: CadastroLocalComponent },
  { path: 'cadastro-gerencia/cadastro-turma', data: { title: 'SIFES | Cadastrar Turma' }, component: CadastroTurmaComponent },
  { path: 'cadastro-gerencia/cadastro-coordenador', data: { title: 'SIFES | Cadastrar Coordenador' }, component: CadastroCoordenadorComponent },
  { path: 'cadastro-gerencia/cadastro-disciplina', data: { title: 'SIFES | Cadastrar Disciplina' }, component: CadastroDisciplinaComponent },
  { path: 'cadastro-gerencia/cadastro-aluno', data: { title: 'SIFES | Cadastrar Aluno' }, component: CadastroAlunoComponent },

  { path: 'importar-dados', component: ImportDataComponent },
  { path: 'alocar-local', component: AllocateLocationComponent },
  { path: 'horarios', component: SchedulesComponent },
  //{ path: '**',component: PageNotFoundComponent }, -- Caso queira criar uma pagina para NotFound
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRouting { }
