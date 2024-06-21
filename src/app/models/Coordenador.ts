import { Coordenadoria } from "./Coordenadoria";

export interface Coordenador {
  _id: number,
  name: string,
  role: string,
  coordination: Coordenadoria
}
