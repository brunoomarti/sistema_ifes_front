import { EquipamentoLocal } from "./EquipamentoLocal";

export interface Local {
  _id: number,
  name: string,
  capacity: number,
  equipments: EquipamentoLocal[]
}
