import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-horario',
  standalone: true,
  imports: [],
  templateUrl: './dialog-horario.component.html',
  styleUrl: './dialog-horario.component.css'
})
export class DialogHorarioComponent {

  constructor(
    public dialogRef: MatDialogRef<DialogHorarioComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  okButton(): void {
    this.dialogRef.close();
  }

}
