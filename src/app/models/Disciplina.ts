import { Curso } from "./Curso";

export interface Disciplina {
  _id: number,
  name: string,
  acronym: string,
  course: Curso
}
