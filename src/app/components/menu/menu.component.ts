import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    MatIconModule,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css', '/src/styles.css']
})
export class MenuComponent implements OnInit {

  ngOnInit() {
    this.toggleClicked(2);
  }

  selectedButton: number | null = null;
  showCadastroGerencia: boolean = false;

  toggleClicked(buttonNumber: number) {
    if (this.selectedButton === buttonNumber) {
      this.selectedButton = null;
    } else {
      this.selectedButton = buttonNumber;
      if (buttonNumber === 2) {
        this.showCadastroGerencia = true;
      } else {
        this.showCadastroGerencia = false;
      }
    }
  }


}
