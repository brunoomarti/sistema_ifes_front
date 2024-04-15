import { Equipamento } from "./Equipamento";
import { Local } from "./Local";

export interface EquipamentoLocal {
    _id: number,
    equipment: Equipamento,
    quantity: number
}
