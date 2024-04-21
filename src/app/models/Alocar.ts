import { Aula } from "./Aula";
import { Horario } from "./Horario";
import { Local } from "./Local";
import { Turma } from "./Turma";

export interface Alocar {
  _id: number,
  lesson: Aula,
  classe: Turma,
  schedule: Horario,
  startDate: Date,
  endDate: Date,
  location: Local
}
