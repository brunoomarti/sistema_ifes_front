import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Semestre } from '../../models/Semestre';
import { SemestreService } from '../cadastro-gerencia/semestre/service/semestre.service';
import { AulaService } from '../allocate-location/aula/service/aula.service';
import { HorarioIndividual } from '../../models/HorarioIndividual';
import { MatDialog } from '@angular/material/dialog';
import { ListagemComponent } from './listagem/listagem.component';
import { SharedService } from '../../shared-services/shared.service';
import { AlunoService } from '../cadastro-gerencia/aluno/service/aluno.service';
import { ProfessorService } from '../cadastro-gerencia/professor/service/professor.service';
import { ModalDialogOkComponent } from '../modal-dialog/modal-dialog-ok/modal-dialog-ok.component';

@Component({
  selector: 'app-schedules',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './schedules.component.html',
  styleUrl: './schedules.component.css',
})
export class SchedulesComponent implements OnInit {
  form: FormGroup;
  periodos: Semestre[] = [];
  horarioIndividual: HorarioIndividual[] = [];
  semesterId: number = 0;
  tabela: any[][] = [];
  alunoSelecionado: any;
  professorSelecionado: any;
  userRole: string | null = '';

  constructor(
    private formBuilder: FormBuilder,
    private semestreService: SemestreService,
    private service: AulaService,
    private alunoService: AlunoService,
    private dialog: MatDialog,
    private sharedService: SharedService,
    private professorService: ProfessorService
  ) {
    this.form = this.formBuilder.group({
      _id: 0,
      scheduleType: null,
      scheduleStudent: null,
      scheduleTeacher: null,
      schedulePeriod: null,
    });
  }

  ngOnInit(): void {
    this.semestreService.listar().subscribe((periodos) => {
      this.periodos = periodos;
    });

    this.formInit();

    if (typeof localStorage !== 'undefined') {
      this.userRole = localStorage.getItem('role');
    }
  }

  formInit() {
    this.form.setValue({
      _id: 0,
      scheduleType: 'Aluno',
      scheduleStudent: null,
      scheduleTeacher: null,
      schedulePeriod: null,
    });
  }

  onScheduleTypeChange(event: any) {
    const selectedType = event.target.value;
    if (selectedType === 'Aluno') {
      this.form.controls['scheduleTeacher'].reset();
    } else if (selectedType === 'Professor') {
      this.form.controls['scheduleStudent'].reset();
    }
  }

  onList() {
    const scheduleType = this.form.get('scheduleType')?.value;
    if (this.userRole === 'ADMIN' || this.userRole === 'COORDINATOR') {
      if (scheduleType === 'Aluno') {
        const dialogData = {
          title: 'Listagem de alunos.',
          tipo: scheduleType,
        };
        this.openDialog(dialogData);
      } else if (scheduleType === 'Professor') {
        const dialogData = {
          title: 'Listagem de professores.',
          tipo: scheduleType,
        };
        this.openDialog(dialogData);
      }
    }

    if (this.userRole === 'STUDENT') {
      const dialogData = {
        title: 'Listagem de alunos.',
        tipo: 'Aluno',
      };
      this.openDialog(dialogData);
    } else if (this.userRole === 'TEACHER') {
      const dialogData = {
        title: 'Listagem de professores.',
        tipo: 'Professor',
      };
      this.openDialog(dialogData);
    }
  }

  openDialog(data: any): void {
    const dialogRef = this.dialog.open(ListagemComponent, {
      data: data,
      backdropClass: 'backdrop',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.tipo === 'Aluno') {
        this.form
          .get('scheduleStudent')
          ?.setValue(result.objetoSelecionado.studentCode);
      } else {
        this.professorSelecionado = result;
        this.form
          .get('scheduleTeacher')
          ?.setValue(result.objetoSelecionado.teacherCode);
      }
    });
  }

<<<<<<< Updated upstream
  onSubmit() {
    let scheduleType = "";

    if (this.userRole === 'STUDENT'){
      scheduleType = 'Aluno';
    } else  if (this.userRole === 'TEACHER'){
      scheduleType = 'Professor'
    } else {
      scheduleType = this.form.get('scheduleType')?.value;
    }
=======
  openDialogOk(data: any): void {
    this.dialog.open(ModalDialogOkComponent, {
      data: data,
      backdropClass: 'backdrop',
    });
  }

  onSubmit() {
    const scheduleType = this.form.get('scheduleType')?.value;
    const missingFields: string[] = [];
>>>>>>> Stashed changes

    console.log(scheduleType)

    const selectedSemester = this.periodos.find(
      (obj) => obj._id == this.form.value.schedulePeriod
    );

    if (scheduleType === 'Aluno') {
      if (this.form.get('scheduleStudent')?.value === null) {
        missingFields.push('<li>Matrícula do aluno</li>');
      }
    } else if (scheduleType === 'Professor') {
      if (this.form.get('scheduleTeacher')?.value === null) {
        missingFields.push('<li>Código do professor</li>');
      }
    }

<<<<<<< Updated upstream
    if (scheduleType === 'Aluno') {
      const code = this.form.get('scheduleStudent')?.value;
      this.alunoService
        .idByCode(code)
        .subscribe(
=======
    if (selectedSemester) {
      this.semesterId = selectedSemester._id;
    } else {
      missingFields.push('<li>Semestre</li>');
    }

    if (missingFields.length > 0) {
      const dialogDataForm = {
        title: 'Erro ao pesquisar',
        message: `É necessário que os seguintes campos sejam preenchidos: ${missingFields.join(
          ''
        )}`,
      };
      this.openDialogOk(dialogDataForm);
    } else {
      if (scheduleType === 'Aluno') {
        const code = this.form.get('scheduleStudent')?.value;

        this.alunoService.idByCode(code).subscribe(
>>>>>>> Stashed changes
          (result) => {
            this.alunoSelecionado = result;
          },
          (error) => {
            console.log('não achou aluno');
          }
        );

<<<<<<< Updated upstream
      this.service
        .findLessonsByStudentCodeAndSemesterId(code, this.semesterId)
        .subscribe(
          (result) => {
            this.horarioIndividual = result;
            this.onSuccess(scheduleType);
          },
          (error) => {
            this.onFailed();
          }
        );
    } else if (scheduleType === 'Professor') {
      const code = this.form.get('scheduleTeacher')?.value;

      console.log("p " + code) 

      this.service
        .findLessonsByTeacherCodeAndSemesterId(code, this.semesterId)
        .subscribe(
          (result) => {
            this.horarioIndividual = result;
            this.onSuccess(scheduleType);
          },
          (error) => {
            this.onFailed();
          }
        );
=======
        this.service
          .findLessonsByStudentCodeAndSemesterId(code, this.semesterId)
          .subscribe(
            (result) => {
              this.horarioIndividual = result;
              this.onSuccess(scheduleType);
            },
            (error) => {
              this.onFailed();
            }
          );
      } else if (scheduleType === 'Professor') {
        const code = this.form.get('scheduleTeacher')?.value;
        console.log(code);
        console.log(this.semesterId);
        this.service
          .findLessonsByTeacherCodeAndSemesterId(code, this.semesterId)
          .subscribe(
            (result) => {
              this.horarioIndividual = result;
              this.onSuccess(scheduleType);
            },
            (error) => {
              this.onFailed();
            }
          );
      }
>>>>>>> Stashed changes
    }
  }

  onFailed() {
    console.log('err');
  }

  onSuccess(tipo: string) {
    if (tipo === 'Aluno') {
      const obj = {
        name: this.alunoSelecionado.name,
        registration: this.alunoSelecionado.studentCode,
        type: 'Aluno',
      };
      this.sharedService.setData(obj);
      this.form.get('scheduleStudent')?.setValue('');
    } else {
      const obj = {
        name: this.professorSelecionado.objetoSelecionado.name,
        registration: this.professorSelecionado.objetoSelecionado.teacherCode,
        type: 'Professor',
      };
      this.sharedService.setData(obj);
      this.form.get('scheduleTeacher')?.setValue('');
    }
    this.preencheVetor(tipo);
    this.preencheTabela();
  }

  preencheVetor(tipo: string) {
    const horarios = [
      '07:00',
      '07:50',
      '08:40',
      '09:50',
      '10:40',
      '11:30',
      '13:00',
      '13:50',
      '14:40',
      '15:50',
      '16:40',
      '17:30',
      '18:50',
      '19:35',
      '20:30',
      '21:15',
    ];

    const diasSemana = [
      'Segunda-feira',
      'Terça-feira',
      'Quarta-feira',
      'Quinta-feira',
      'Sexta-feira',
      'Sábado',
      'Domingo',
    ];

    for (let i = 0; i < 6; i++) { // Corrigido para considerar somente dias úteis
      this.tabela[i] = [];
      const diaSemana = diasSemana[i];
      for (let j = 0; j < 16; j++) {
        const horario = horarios[j];
        this.preencheCelula(diaSemana, horario, i, j, tipo);
      }
    }
  }

  preencheTabela() {
    const table = document.querySelector('.scheduleTable') as HTMLTableElement;

    for (let i = 0; i < 6; i++) { // Ajustado para considerar somente dias úteis
      const row = table.querySelectorAll(`.tableContent:nth-child(${i + 3}) td`);

      for (let j = 0; j < 16; j++) {
        if (row[j]) {
          row[j].textContent = this.tabela[i][j];
        }
      }
    }
  }

  preencheCelula(diaSemana: string, horario: string, i: number, j: number, tipo: string) {
  preencheCelula(
    diaSemana: string,
    horario: string,
    i: number,
    j: number,
    tipo: string
  ) {
    this.horarioIndividual.forEach((element) => {
      element.allocations.forEach((allocation) => {
        if (allocation.weekDay === diaSemana) {
          if (allocation.active) {
            allocation.selectedTimes.forEach((time) => {
              if (time.startTime === horario) {
                if (tipo === 'Aluno'){
                if (tipo === 'Aluno') {
                  const firstName = element.teacher.name.split(' ')[0];
                  this.tabela[i][j] =
                    firstName +
                    '\n' +
                    element.discipline.acronym +
                    '\n' +
                    allocation.location.name;
                } else {
                  this.tabela[i][j] =
                    allocation.classe.name +
                    '\n' +
                    element.discipline.acronym +
                    '\n' +
                    allocation.location.name;
                }
              }
            });
          }
        }
      });
    });
  }

  onPrint() {
    const scheduleType = this.form.get('scheduleType')?.value;
    const aluno = this.alunoSelecionado?.name;
    const matricula = this.alunoSelecionado?.studentCode;
    const professor = this.professorSelecionado?.objetoSelecionado?.name;
    const professorCode = this.professorSelecionado?.objetoSelecionado?.teacherCode;
    const dataImpressao = new Date().toLocaleString();
    const missingFields: string[] = [];

    if ((scheduleType === 'Aluno' && !aluno) || (scheduleType === 'Professor' && !professor)) {
      missingFields.push('<li>Pesquise por um aluno ou professor antes de imprimir.</li>');
    }

    if (missingFields.length > 0) {
      const dialogDataForm = {
        title: 'Erro ao pesquisar',
        message: `${missingFields.join(
          ''
        )}`,
      };
      this.openDialogOk(dialogDataForm);
    } else {
      let printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Horário do ${
          scheduleType === 'Aluno' ? 'Aluno' : 'Professor'
        }</title>
        <style>
          @import url("https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300..700&display=swap");
          @import url("https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap");

          .printBody {
              border: solid black 1px;
              border-radius: 10px;
              width: 100%;
              height: 100%;
              margin: 0;
              padding: 20px;
              box-sizing: border-box;
          }
          body {
              margin: 0;
              padding: 0;
              font-family: Arial, sans-serif;
              font-size: 12px;
              width: 80mm;
              height: 297mm;
              box-sizing: border-box;
          }
          h1 {
              font-size: 16px;
              margin: 0;
              padding: 0;
              font-family: "Space Mono", monospace;
              font-weight: 700;
              font-style: normal;
          }
          h2 {
              font-size: 14px;
              margin: 0;
              padding: 0;
              font-family: "Space Grotesk", sans-serif;
              font-optical-sizing: auto;
              font-weight: 600;
              font-style: normal;
          }
          .logoIfes {
              width: 100%;
              display: flex;
              justify-content: center;
              align-items: center;
          }
          .logoIfes img {
              max-width: 100%;
              height: auto;
              object-fit: contain;
              filter: invert(100%);
              margin: 0 0 18px 0;
          }
          .separator {
              width: 100%;
              background-color: black;
              height: 1px;
              margin: 16px 0;
          }
          p {
              font-family: "Space Grotesk", sans-serif;
              font-optical-sizing: auto;
              font-weight: 400;
              font-style: normal;
          }
          .bodyText {
              font-size: 12px;
          }
          .tabelaDia {
              margin: 5px 0 0 0;
          }
          table {
              width: 100%;
              border-collapse: collapse;
          }
          td:not(:first-child), td:not(:last-child) {
            border-top: 1px solid grey;
          }
          th:first-child, td:first-child {
              border-right: 1px solid grey;
          }
          th:last-child, td:last-child {
              border-left: 1px solid grey;
          }
          th {
              text-align: left;
              padding: 5px;
          }
          .tableHeader th {
              font-family: "Space Grotesk", sans-serif;
              font-optical-sizing: auto;
              font-weight: 700;
              font-style: normal;
              font-size: 12px;
          }
          .tableBody th, .tableBody td {
              font-family: "Space Grotesk", sans-serif;
              font-optical-sizing: auto;
              font-weight: 400;
              font-style: normal;
              font-size: 11px;
              padding: 4px;
          }
          .horarioCol {
              width: 10mm; /* Tamanho fixo para a coluna de horários */
          }

          @media print {
              @page {
                  size: 80mm 297mm;
                  margin: 0;
              }
              body {
                  margin: 0;
                  padding: 0 20px 20px 20px;
                  width: 80mm;
                  height: fit-content;
                  box-sizing: border-box;
                  -webkit-print-color-adjust: exact;
              }
              .printBody {
                  border: solid black 1px;
                  border-radius: 10px;
                  width: 100%;
                  height: 100%;
                  margin: 0;
                  padding: 20px;
                  box-sizing: border-box;
              }
              .logoIfes img {
                  filter: invert(100%);
              }
              .separator {
                  background-color: black;
              }
          }
        </style>
      </head>
      <body>
        <div class="printBody">
          <div class="logoIfes">
            <img src="./../../../assets/images/logo-ifes-branco-no-borders.png" alt="Logo IFES" />
          </div>
          <div class="header">
            <h1>RELATÓRIO DE AULAS</h1>
            <h2>${
              scheduleType === 'Aluno'
                ? 'Aluno: ' + aluno
                : 'Professor: ' + professor
            }</h2>
            ${
              scheduleType === 'Aluno'
                ? `<h2>Matrícula: ${matricula}</h2>`
                : `<h2>Código: ${professorCode}</h2>`
            }
          </div>
          <div class="separator"></div>
          <p class="bodyText">Data de requisição: ${dataImpressao}</p>
          <div class="separator"></div>
    `;

      const diasSemanaOrdenados = [
        'Segunda-feira',
        'Terça-feira',
        'Quarta-feira',
        'Quinta-feira',
        'Sexta-feira',
        'Sábado',
        'Domingo',
      ];

      const timeToMinutes = (time: String): number => {
        const [hours, minutes] = time.split(':').map(Number);
        return hours * 60 + minutes;
      };

      diasSemanaOrdenados.forEach((dia) => {
        const aulasDoDia = this.horarioIndividual.filter((item) =>
          item.allocations.some((aula) => aula.weekDay === dia)
        );

        if (aulasDoDia.length > 0) {
          printContent += `
            <h2>${dia}</h2>
            <div class="tabelaDia">
              <table>
                <tr class="tableHeader">
                  <th class="horarioCol">Horário</th>
                  <th>Disciplina</th>
                  <th>Local</th>
                </tr>
            `;

          // Ordenar as aulas por horário de início
          const sortedAulas = aulasDoDia.flatMap(item =>
            item.allocations
              .filter(aula => aula.weekDay === dia)
              .flatMap(aula => aula.selectedTimes.map(time => ({
                startTime: time.startTime,
                endTime: time.endTime,
                discipline: item.discipline.name,
                location: aula.location.name
              })))
          ).sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));

          sortedAulas.forEach(aula => {
            printContent += `
              <tr class="tableBody">
                <td class="horarioCol">${aula.startTime} - ${aula.endTime}</td>
                <td>${aula.discipline}</td>
                <td>${aula.location}</td>
              </tr>`;
          });

          printContent += `
              </table>
            </div>
            <div class="separator"></div>
            `;
        }
      });

      printContent += `
        </div>
      </body>
      </html>
    `;

      const printWindow = window.open('', '_blank', 'width=800,height=600');

      if (printWindow) {
        printWindow.document.write(printContent);
        printWindow.document.close();
        setTimeout(() => {
          printWindow?.print();
        }, 500); // 500 milissegundos de atraso
      }
    }
  }
}
