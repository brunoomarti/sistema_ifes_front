import { Aula } from "./Aula";
import { Local } from "./Local";
import { Turma } from "./Turma";
import { Evento } from "./Evento";

export interface Alocar {
  _id: number,
  lesson: Aula,
  event: Evento,
  classe: Turma,
  startDate: String,
  endDate: String,
  location: Local,
  type: String
}
