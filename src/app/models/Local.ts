import { Equipamento } from "./Equipamento";

export interface Local {
  _id: number,
  name: string,
  capacity: number,
  equipment: Equipamento
}
