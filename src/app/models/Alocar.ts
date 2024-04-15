import { Aula } from "./Aula";
import { Horario } from "./Horario";
import { Local } from "./Local";
import { Turma } from "./Turma";

export interface Alocar {
  _id: number,
  lesson: Aula,
  turma: Turma,
  schedule: Horario,
  date: Date,
  location: Local
}
