import { Alocar } from "./Alocar";
import { Aluno } from "./Aluno";
import { Disciplina } from "./Disciplina";
import { Professor } from "./Professor";
import { Semestre } from "./Semestre";

export interface HorarioIndividual {
  allocated: boolean,
  allocations: Alocar[],
  discipline: Disciplina,
  semester: Semestre,
  students: Aluno[],
  teacher: Professor,
  weeklyQuantity: number
}
