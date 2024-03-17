import { GerenciaCoordenadorComponent } from './components/cadastro-gerencia/coordenador/gerencia-coordenador/gerencia-coordenador/gerencia-coordenador.component';
import { CadastroCoordenadorComponent } from './components/cadastro-gerencia/coordenador/cadastro-coordenador/cadastro-coordenador.component';
import { CadastroLocalComponent } from './components/cadastro-gerencia/local/cadastro-local.component';
import { CadastroTurmaComponent } from './components/cadastro-gerencia/turma/cadastro-turma/cadastro-turma.component';
import { CadastroAlunoComponent } from './components/cadastro-gerencia/aluno/cadastro-aluno/cadastro-aluno.component';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CadastroGerenciaComponent } from './components/cadastro-gerencia/cadastro-gerencia-principal/cadastro-gerencia.component';
import { HomeComponent } from './components/home/home.component';
import { ImportDataComponent } from './components/import-data/import-data.component';
import { AllocateLocationComponent } from './components/allocate-location/allocate-location.component';
import { SchedulesComponent } from './components/schedules/schedules.component';
import { CadastroDisciplinaComponent } from './components/cadastro-gerencia/disciplina/cadastro-disciplina/cadastro-disciplina.component';
import { GerenciaTurmaComponent } from './components/cadastro-gerencia/turma/gerencia-turma/gerencia-turma/gerencia-turma.component';
import { GerenciaDisciplinaComponent } from './components/cadastro-gerencia/disciplina/gerencia-disciplina/gerencia-disciplina/gerencia-disciplina.component';
import { GerenciaAlunoComponent } from './components/cadastro-gerencia/aluno/gerencia-aluno/gerencia-aluno/gerencia-aluno.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },

  { path: 'cadastro-gerencia', component: CadastroGerenciaComponent },
  { path: 'cadastro-gerencia/cadastro-local', data: { title: 'SIFES | Cadastrar Local' }, component: CadastroLocalComponent },
  { path: 'cadastro-gerencia/cadastro-turma', data: { title: 'SIFES | Cadastrar Turma' }, component: CadastroTurmaComponent },
  { path: 'cadastro-gerencia/gerencia-turma', data: { title: 'SIFES | Gerenciar Turma' }, component: GerenciaTurmaComponent },
  { path: 'cadastro-gerencia/cadastro-coordenador', data: { title: 'SIFES | Cadastrar Coordenador' }, component: CadastroCoordenadorComponent },
  { path: 'cadastro-gerencia/gerencia-coordenador', data: { title: 'SIFES | Gerenciar Coordenador' }, component: GerenciaCoordenadorComponent },
  { path: 'cadastro-gerencia/cadastro-disciplina', data: { title: 'SIFES | Cadastrar Disciplina' }, component: CadastroDisciplinaComponent },
  { path: 'cadastro-gerencia/gerencia-disciplina', data: { title: 'SIFES | Gerenciar Disciplina' }, component: GerenciaDisciplinaComponent },
  { path: 'cadastro-gerencia/cadastro-aluno', data: { title: 'SIFES | Cadastrar Aluno' }, component: CadastroAlunoComponent },
  { path: 'cadastro-gerencia/gerencia-aluno', data: { title: 'SIFES | Gerenciar Aluno' }, component: GerenciaAlunoComponent },

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
