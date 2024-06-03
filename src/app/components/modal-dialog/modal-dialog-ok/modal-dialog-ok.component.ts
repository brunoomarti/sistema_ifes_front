import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-dialog-ok',
  standalone: true,
  imports: [],
  templateUrl: './modal-dialog-ok.component.html',
  styleUrl: './modal-dialog-ok.component.css'
})
export class ModalDialogOkComponent {

  constructor(
    public dialogRef: MatDialogRef<ModalDialogOkComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  okButton(): void {
    this.dialogRef.close();
  }

}
