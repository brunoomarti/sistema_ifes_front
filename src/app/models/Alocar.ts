import { Aula } from "./Aula";
import { Local } from "./Local";
import { Turma } from "./Turma";
import { Evento } from "./Evento";
import { Horario } from "./Horario";

export interface Alocar {
  _id: number,
  lesson: Aula,
  event: Evento,
  classe: Turma,
  startDate: String,
  endDate: String,
  startTime: String,
  endTime: String,
  selectedTimes: Horario[],
  location: Local,
  type: String,
  diaSemana: String,
  alocacao: Alocar
}
