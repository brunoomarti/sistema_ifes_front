import { Component } from '@angular/core';
import { NewEditEquipComponent } from '../new-edit-equip/new-edit-equip.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-main-content',
  standalone: true,
  imports: [],
  templateUrl: './main-content.component.html',
  styleUrl: './main-content.component.css'
})
export class MainContentComponent {

  constructor(public dialog: MatDialog) {}

  novoEquipamento(): void {
    const dialogRef = this.dialog.open(NewEditEquipComponent, {
      disableClose: true,
      backdropClass: 'backdrop',
    });
  }

}
