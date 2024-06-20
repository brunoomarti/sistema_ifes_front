import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-janela-select-barcode',
  standalone: true,
  imports: [],
  templateUrl: './janela-select-barcode.component.html',
  styleUrl: './janela-select-barcode.component.css'
})
export class JanelaSelectBarcodeComponent {

  constructor(
    public dialogRef: MatDialogRef<JanelaSelectBarcodeComponent>
  ) {}

  okButton(): void {
    this.dialogRef.close();
  }

}
