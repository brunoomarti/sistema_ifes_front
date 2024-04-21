import { Aula } from "./Aula";
import { Local } from "./Local";
import { Turma } from "./Turma";
import { AlocaHorario } from "./AlocaHorario";
import { Evento } from "./Evento";

export interface Alocar {
  _id: number,
  lesson: Aula,
  event: Evento,
  classe: Turma,
  selectedTimes: AlocaHorario,
  startDate: Date,
  endDate: Date,
  location: Local,
  type: String
}
