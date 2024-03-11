import { Component } from '@angular/core';
import { NewEditEquipComponent } from '../new-edit-equip/component/new-edit-equip.component';
import { MatDialog } from '@angular/material/dialog';
import { EquipmentService } from '../new-edit-equip/services/new-edit-equip.service';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-main-content',
  standalone: true,
  imports: [],
  templateUrl: './main-content.component.html',
  styleUrl: './main-content.component.css'
})
export class MainContentComponent {

  constructor(public dialog: MatDialog, private service: EquipmentService, private http: HttpClient) {}

  novoEquipamento(): void {
    const dialogRef = this.dialog.open(NewEditEquipComponent, {
      disableClose: true,
      backdropClass: 'backdrop',
    });
  }

}
