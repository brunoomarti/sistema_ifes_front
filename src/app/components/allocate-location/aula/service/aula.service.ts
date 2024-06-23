import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Aula } from '../../../../models/Aula';
import { Observable, first, map, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AulaService {

  private readonly API = 'api/lesson';

  constructor(private httpClient: HttpClient) { }

  save(record: Partial<Aula>) {
    if (record._id) {
      return this.update(record);
    }
    return this.create(record);
  }

  private create(record: Partial<Aula>) {
    return this.httpClient.post<Aula>(`${this.API}`, record).pipe(first());
  }

  private update(record: Partial<Aula>) {
    return this.httpClient.put<Aula>(`${this.API}/${record._id}`, record).pipe(first());
  }

  listar() {
    return this.httpClient.get<Aula[]>(this.API)
      .pipe(
        first(),
        tap(aulas => console.log()))
  }

  listarAlunosPorAula(id: string) {
    return this.httpClient.get<Aula>(`${this.API}/${id}`).pipe(
      map(aula => aula.students)
    );
  }

  loadById(id: string) {
    return this.httpClient.get<Aula>(`${this.API}/${id}`);
  }

  remove(ids: number[]) {
    return this.httpClient.post(`${this.API}/delete-multiple`, ids);
  }


  removerAlunoDaAula(studentIds: number[], lessonId: string): Observable<void> {
    let lessonIdInt: number = parseInt(lessonId);
    return this.httpClient.delete<void>(`${this.API}/removeStudents/${lessonIdInt}`, {
      body: studentIds
    });
  }

  findLessonsByStudentCodeAndSemesterId(studentCode: number, semesterId: number) {
    return this.httpClient.get<any>(`${this.API}/getLessons/${studentCode}/${semesterId}`);
  }

  findLessonsByTeacherCodeAndSemesterId(teacherCode: number, semesterId: number) {
    return this.httpClient.get<any>(`${this.API}/getLessonsT/${teacherCode}/${semesterId}`);
  }

}
