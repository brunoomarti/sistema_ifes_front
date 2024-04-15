import { Disciplina } from "./Disciplina";
import { Professor } from "./Professor";
import { Semestre } from "./Semestre";

export interface Aula {
  _id: number,
  discipline: Disciplina,
  teacher: Professor,
  semester: Semestre
}
