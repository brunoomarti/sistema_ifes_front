import { Aula } from "./Aula";
import { Local } from "./Local";
import { Turma } from "./Turma";
import { Evento } from "./Evento";
import { Horario } from "./Horario";
import { Alocar } from "./Alocar";

export interface Historico {
  _id: number,
  lesson: Aula,
  event: Evento,
  classe: Turma,
  startDate: String,
  endDate: String,
  startTime: String,
  endTime: String,
  selectedTimes: String,
  location: Local,
  type: String,
  weekDay: String,
  alocacao: Alocar,
  date: String,
  authorName: String,
  changeType: String,
}
