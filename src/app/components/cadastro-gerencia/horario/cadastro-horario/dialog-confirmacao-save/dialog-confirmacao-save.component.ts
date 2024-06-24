import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-confirmacao-save',
  standalone: true,
  imports: [],
  templateUrl: './dialog-confirmacao-save.component.html',
  styleUrl: './dialog-confirmacao-save.component.css'
})
export class DialogConfirmacaoSaveComponent {

  constructor(
    public dialogRef: MatDialogRef<DialogConfirmacaoSaveComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  accept() {
    this.dialogRef.close('sim');
  }

  cancel(): void {
    this.dialogRef.close();
  }

}
