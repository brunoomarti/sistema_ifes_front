import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { ProfessorService } from '../service/professor.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { ReloadService } from '../../../../shared-services/reload.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Professor } from '../../../../models/Professor';
import { CoordenadoriaService } from '../../coordenadoria/service/coordenadoria.service';
import { Coordenadoria } from '../../../../models/Coordenadoria';
import { ModalDialogOkComponent } from '../../../modal-dialog/modal-dialog-ok/modal-dialog-ok.component';

@Component({
  selector: 'app-edicao-professor',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatIcon
  ],
  templateUrl: './edicao-professor.component.html',
  styleUrl: './edicao-professor.component.css'
})
export class EdicaoProfessorComponent implements OnInit {

  professores: Professor[] = [];
  form: FormGroup;
  mensagemSnackbarAcerto: string = 'Professor editado com sucesso.';
  mensagemSnackbarErro: string = 'Erro ao editar professor.';
  coordenadorias: Coordenadoria[] = [];

  constructor(
    public dialogRef: MatDialogRef<EdicaoProfessorComponent>,
    private formBuilder: FormBuilder,
    private service: ProfessorService,
    private coordinationService: CoordenadoriaService,
    private snackBar: MatSnackBar,
    private reloadService: ReloadService,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
  )

  {
    this.form = this.formBuilder.group({
      _id: 0,
      name: ['', Validators.required],
      educationLevel: ['Licenciatura', Validators.required],
      coordinator: [false, Validators.required],
      coordination: ['', Validators.required],
      teacherCode: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.coordinationService.listar().subscribe(coordenadorias => {
      this.coordenadorias = coordenadorias;
    });

    this.service.listar().subscribe(professores => {
      this.professores = professores;
    });

    const obj: Professor = this.data.professor;
    if (obj) {
      console.log(obj)
      this.form.setValue({
        _id: obj._id,
        name: obj.name,
        educationLevel: obj.educationLevel,
        coordinator: obj.coordinator,
        coordination: obj.coordination,
        teacherCode: obj.teacherCode
      });
    }
  }

  onSubmit() {
    if (this.form.valid) {
        let coordenador = this.form.get('coordinator')?.value;
        let coordenacao = this.form.get('coordination')?.value;

        const errors: string[] = [];

        if (coordenador){
          console.log("sssss")
          const professoresDaCoordenacao = this.professores.filter(professor => professor.coordination._id == this.form.value.coordination);
         
          let coordenadorPresente;
          let nomeCoord;

          console.log(professoresDaCoordenacao);

          professoresDaCoordenacao.forEach(professor => {
            if (professor.coordinator){
              coordenadorPresente = professor.coordinator;
              nomeCoord = professor.name;
            }
            
          });

          if (coordenadorPresente) {
            errors.push(`Já existe um coordenador para este curso. Coordenador de curso atual: <strong>${nomeCoord}</strong>`);
          }

          if (errors.length > 0) {
            const dialogData = {
                title: 'Erro ao Cadastrar',
                message: errors.join('<br>')
            };
            this.openOkDialog(dialogData);
          } else {
            //this.save();
          }

      } else {
        this.save();
      }
    } else {
        const missingFields = [];
        if (this.form.get('name')?.hasError('required')) {
            missingFields.push('<li>Nome</li>');
        }
        if (this.form.get('educationLevel')?.hasError('required')) {
            missingFields.push('<li>Grau acadêmico</li>');
        }
        if (this.form.get('coordination')?.hasError('required')) {
            missingFields.push('<li>Coordenadoria</li>');
        }
        const dialogDataForm = {
            title: 'Erro ao Cadastrar',
            message: `É necessário que os seguintes campos sejam preenchidos: ${missingFields.join('')}`,
        };
        this.openOkDialog(dialogDataForm);
    }
  }

  openOkDialog(data: any): void {
    this.dialog.open(ModalDialogOkComponent, {
      data: data,
      backdropClass: 'backdropTwo'
    });
  }

  save() {
    const selectedCoordination = this.coordenadorias.find(coord => coord._id == this.form.value.coordination);

    if (selectedCoordination) {
        this.form.patchValue({ coordination: selectedCoordination });
    }

    console.log(this.form.value)
    this.service.save(this.form.value).subscribe(result => this.onSucess(), error => this.onFailed());
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSucess() {
    this.snackBar.open(this.mensagemSnackbarAcerto, '', { duration: 5000, panelClass: ['successSnackbar'] });
    this.reloadService.triggerReload();
    this.dialogRef.close();
  }

  onFailed() {
    this.snackBar.open(this.mensagemSnackbarErro, '', { duration: 5000, panelClass: ['errorSnackbar'] });
    this.dialogRef.close();
  }

}
