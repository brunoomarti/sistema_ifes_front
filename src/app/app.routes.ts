import { GerenciaCoordenadoriaComponent } from './components/cadastro-gerencia/coordenadoria/gerencia-coordenadoria/gerencia-coordenadoria.component';
import { CadastroCoordenadoriaComponent } from './components/cadastro-gerencia/coordenadoria/cadastro-coordenadoria/cadastro-coordenadoria.component';
import { GerenciaCoordenadorComponent } from './components/cadastro-gerencia/coordenador/gerencia-coordenador/gerencia-coordenador/gerencia-coordenador.component';
import { CadastroCoordenadorComponent } from './components/cadastro-gerencia/coordenador/cadastro-coordenador/cadastro-coordenador.component';
import { CadastroLocalComponent } from './components/cadastro-gerencia/local/cadastro-local/cadastro-local.component';
import { CadastroTurmaComponent } from './components/cadastro-gerencia/turma/cadastro-turma/cadastro-turma.component';
import { CadastroAlunoComponent } from './components/cadastro-gerencia/aluno/cadastro-aluno/cadastro-aluno.component';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CadastroGerenciaComponent } from './components/cadastro-gerencia/cadastro-gerencia-principal/cadastro-gerencia.component';
import { HomeComponent } from './components/home/home.component';
import { ImportDataComponent } from './components/import-data/import-data.component';
import { AllocateLocationComponent } from './components/allocate-location/allocate-main/allocate-location.component';
import { SchedulesComponent } from './components/schedules/schedules.component';
import { CadastroDisciplinaComponent } from './components/cadastro-gerencia/disciplina/cadastro-disciplina/cadastro-disciplina.component';
import { GerenciaTurmaComponent } from './components/cadastro-gerencia/turma/gerencia-turma/gerencia-turma/gerencia-turma.component';
import { GerenciaDisciplinaComponent } from './components/cadastro-gerencia/disciplina/gerencia-disciplina/gerencia-disciplina/gerencia-disciplina.component';
import { GerenciaAlunoComponent } from './components/cadastro-gerencia/aluno/gerencia-aluno/gerencia-aluno/gerencia-aluno.component';
import { GerenciaSemestreComponent } from './components/cadastro-gerencia/semestre/gerencia-semestre/gerencia-semestre.component';
import { CadastroSemestreComponent } from './components/cadastro-gerencia/semestre/cadastro-semestre/cadastro-semestre.component';
import { CadastroHorarioComponent } from './components/cadastro-gerencia/horario/cadastro-horario/cadastro-horario.component';
import { GerenciaHorarioComponent } from './components/cadastro-gerencia/horario/gerencia-horario/gerencia-horario.component';
import { CadastroProfessorComponent } from './components/cadastro-gerencia/professor/cadastro-professor/cadastro-professor.component';
import { GerenciaProfessorComponent } from './components/cadastro-gerencia/professor/gerencia-professor/gerencia-professor.component';
import { CadastroAulaComponent } from './components/allocate-location/aula/cadastro-aula/cadastro-aula.component';
import { GerenciaAulaComponent } from './components/allocate-location/aula/gerencia-aula/gerencia-aula.component';
import { GerenciaEventoComponent } from './components/allocate-location/evento/gerencia-evento/gerencia-evento.component';
import { CadastroEventoComponent } from './components/allocate-location/evento/cadastro-evento/cadastro-evento.component';
import { GerenciaLocalComponent } from './components/cadastro-gerencia/local/gerencia-local/gerencia-local.component';
import { CadastroCursoComponent } from './components/cadastro-gerencia/curso/cadastro-curso/cadastro-curso.component';
import { GerenciaCursoComponent } from './components/cadastro-gerencia/curso/gerencia-curso/gerencia-curso.component';
import { TelaLoginComponent } from './components/login/tela-login/tela-login.component';
import { AuthGuard } from './components/login/service/auth-guard.service';


export const routes: Routes = [
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'cadastro-gerencia', component: CadastroGerenciaComponent, canActivate: [AuthGuard] },
  { path: 'cadastro-gerencia/cadastro-local', data: { title: 'SIFES | Cadastrar Local' }, component: CadastroLocalComponent, canActivate: [AuthGuard] },
  { path: 'cadastro-gerencia/gerencia-local', data: { title: 'SIFES | Gerenciar Local' }, component: GerenciaLocalComponent, canActivate: [AuthGuard] },
  { path: 'cadastro-gerencia/cadastro-turma', data: { title: 'SIFES | Cadastrar Turma' }, component: CadastroTurmaComponent, canActivate: [AuthGuard] },
  { path: 'cadastro-gerencia/gerencia-turma', data: { title: 'SIFES | Gerenciar Turma' }, component: GerenciaTurmaComponent, canActivate: [AuthGuard] },
  { path: 'cadastro-gerencia/cadastro-coordenador', data: { title: 'SIFES | Cadastrar Coordenador' }, component: CadastroCoordenadorComponent, canActivate: [AuthGuard] },
  { path: 'cadastro-gerencia/gerencia-coordenador', data: { title: 'SIFES | Gerenciar Coordenador' }, component: GerenciaCoordenadorComponent, canActivate: [AuthGuard] },
  { path: 'cadastro-gerencia/cadastro-disciplina', data: { title: 'SIFES | Cadastrar Disciplina' }, component: CadastroDisciplinaComponent, canActivate: [AuthGuard] },
  { path: 'cadastro-gerencia/gerencia-disciplina', data: { title: 'SIFES | Gerenciar Disciplina' }, component: GerenciaDisciplinaComponent, canActivate: [AuthGuard] },
  { path: 'cadastro-gerencia/cadastro-aluno', data: { title: 'SIFES | Cadastrar Aluno' }, component: CadastroAlunoComponent, canActivate: [AuthGuard] },
  { path: 'cadastro-gerencia/gerencia-aluno', data: { title: 'SIFES | Gerenciar Aluno' }, component: GerenciaAlunoComponent, canActivate: [AuthGuard] },
  { path: 'cadastro-gerencia/cadastro-coordenadoria', data: { title: 'SIFES | Cadastrar Coordenadoria' }, component: CadastroCoordenadoriaComponent, canActivate: [AuthGuard] },
  { path: 'cadastro-gerencia/gerencia-coordenadoria', data: { title: 'SIFES | Gerenciar Coordenadoria' }, component: GerenciaCoordenadoriaComponent, canActivate: [AuthGuard] },
  { path: 'cadastro-gerencia/cadastro-semestre', data: { title: 'SIFES | Cadastrar Semestre' }, component: CadastroSemestreComponent, canActivate: [AuthGuard] },
  { path: 'cadastro-gerencia/gerencia-semestre', data: { title: 'SIFES | Gerenciar Semestre' }, component: GerenciaSemestreComponent, canActivate: [AuthGuard] },
  { path: 'cadastro-gerencia/cadastro-horario', data: { title: 'SIFES | Cadastrar Horário' }, component: CadastroHorarioComponent, canActivate: [AuthGuard] },
  { path: 'cadastro-gerencia/gerencia-horario', data: { title: 'SIFES | Gerenciar Horário' }, component: GerenciaHorarioComponent, canActivate: [AuthGuard] },
  { path: 'cadastro-gerencia/cadastro-professor', data: { title: 'SIFES | Cadastrar Professor' }, component: CadastroProfessorComponent, canActivate: [AuthGuard] },
  { path: 'cadastro-gerencia/gerencia-professor', data: { title: 'SIFES | Gerenciar Professor' }, component: GerenciaProfessorComponent, canActivate: [AuthGuard] },
  { path: 'cadastro-gerencia/cadastro-curso', data: { title: 'SIFES | Cadastrar Curso' }, component: CadastroCursoComponent, canActivate: [AuthGuard] },
  { path: 'cadastro-gerencia/gerencia-curso', data: { title: 'SIFES | Gerenciar Curso' }, component: GerenciaCursoComponent, canActivate: [AuthGuard] },
  { path: 'importar-dados', component: ImportDataComponent, canActivate: [AuthGuard] },
  { path: 'alocar-local', component: AllocateLocationComponent, canActivate: [AuthGuard] },
  { path: 'alocar-local/cadastro-evento', data: { title: 'SIFES | Cadastrar Evento' }, component: CadastroEventoComponent, canActivate: [AuthGuard] },
  { path: 'alocar-local/gerencia-evento', data: { title: 'SIFES | Gerenciar Evento' }, component: GerenciaEventoComponent, canActivate: [AuthGuard] },
  { path: 'alocar-local/cadastro-aula', data: { title: 'SIFES | Cadastrar Aula' }, component: CadastroAulaComponent, canActivate: [AuthGuard] },
  { path: 'alocar-local/gerencia-aula', data: { title: 'SIFES | Gerenciar Aula' }, component: GerenciaAulaComponent, canActivate: [AuthGuard] },
  { path: 'horarios', component: SchedulesComponent, canActivate: [AuthGuard] },
  { path: 'login', component: TelaLoginComponent},

  { path: '**', redirectTo: 'login' }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRouting { }
