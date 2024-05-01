import { Alocar } from "./Alocar";

export interface Evento {
  _id: number,
  name: String,
  description: String,
  startTime: String,
  endTime: String,
  allocated: boolean, 
  alocacao: Alocar
}
