import { Coordenadoria } from './Coordenadoria';

export interface Professor {
  _id: number,
  name: String,
  educationLevel: String,
  specialty: String,
  isCoordinator: boolean,
  coordination: Coordenadoria
  teacherCode: String
}
