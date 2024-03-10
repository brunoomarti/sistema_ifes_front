import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    MatIconModule
  ],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css', '/src/styles.css']
})
export class MenuComponent {

  selectedButton: number | null = null;

  toggleClicked(buttonNumber: number) {
    if (this.selectedButton === buttonNumber) {
      this.selectedButton = null;
    } else {
      this.selectedButton = buttonNumber;
    }
  }


}
