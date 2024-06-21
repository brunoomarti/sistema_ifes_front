import { Coordenadoria } from './Coordenadoria';

export interface Professor {
  _id: number,
  name: String,
  educationLevel: String,
  coordinator: boolean,
  coordination: Coordenadoria
  teacherCode: String,
  role: string
}
