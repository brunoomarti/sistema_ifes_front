import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-dialog-sim-nao',
  standalone: true,
  imports: [],
  templateUrl: './modal-dialog-sim-nao.component.html',
  styleUrl: './modal-dialog-sim-nao.component.css'
})
export class ModalDialogSimNaoComponent {

  constructor(
    public dialogRef: MatDialogRef<ModalDialogSimNaoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  permanecerButton(): void {
    this.dialogRef.close();
  }

  sairButton(): void {
    this.dialogRef.close();
    localStorage.removeItem('auth-token');
    localStorage.removeItem('username');
    localStorage.removeItem("role");
    localStorage.removeItem("student_code");
    window.location.reload();
  }

}
