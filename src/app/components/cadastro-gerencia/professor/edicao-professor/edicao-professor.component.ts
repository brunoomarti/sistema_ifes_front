import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { ProfessorService } from '../service/professor.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { ReloadService } from '../../../../shared-services/reload.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Professor } from '../../../../models/Professor';
import { CoordenadoriaService } from '../../coordenadoria/service/coordenadoria.service';
import { Coordenadoria } from '../../../../models/Coordenadoria';

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
    private route: ActivatedRoute,
    private reloadService: ReloadService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  )

  {
    this.form = this.formBuilder.group({
      _id: 0,
      name: '',
      educationLevel: '',
      specialty: '',
      coordinator: false,
      coordination: null,
      teacherCode: ''
    });
  }

  ngOnInit(): void { 
    this.coordinationService.listar().subscribe(coordenadorias => {
      this.coordenadorias = coordenadorias;
    }); 
    
    const obj: Professor = this.data.professor;
    if (obj) {
      console.log(obj)
      this.form.setValue({
        _id: obj._id,
        name: obj.name,
        educationLevel: obj.educationLevel,
        specialty: obj.specialty,
        coordinator: obj.coordinator,
        coordination: obj.coordination,
        teacherCode: obj.teacherCode
      });
    }
  }

  onSubmit() {
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
