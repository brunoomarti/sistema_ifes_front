import { Alocar } from "./Alocar";

export interface Evento {
  _id: number,
  name: string,
  applicant: String,
  description: string,
  startTime: String,
  endTime: String,
  allocated: boolean, 
  alocacao: Alocar
}
