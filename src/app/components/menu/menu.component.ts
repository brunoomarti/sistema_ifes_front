import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs';

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
  selectedButton: number | null = null;

  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd)
      )
      .subscribe((event: NavigationEnd) => {
        this.updateSelectedButton(event.url);
      });
  }

  updateSelectedButton(url: string) {
    if (url.includes('/home')) {
      this.selectedButton = 1;
    } else if (url.includes('/cadastro-gerencia')) {
      this.selectedButton = 2;
    } else if (url.includes('/importar-dados')) {
      this.selectedButton = 3;
    } else if (url.includes('/alocar-local')) {
      this.selectedButton = 4;
    } else if (url.includes('/horarios')) {
      this.selectedButton = 5;
    } else {
      this.selectedButton = null;
    }
  }
}
