import { Curso } from "./Curso";

export interface Aluno {
  _id: number,
  name: string,
  registrationYear: string,
  studentCode: string,
  course: Curso
}
