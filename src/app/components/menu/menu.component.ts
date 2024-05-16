import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs';
import { SharedService } from '../../shared-services/shared.service';

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

  selectedButton: number = 0;

  constructor(
    private router: Router,
    private sharedService: SharedService
  ) {}

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
    }

    this.sharedService.updateSelectedButton(this.selectedButton);
  }

  logout(){
    localStorage.removeItem('auth-token');
    localStorage.removeItem('username');
    window.location.reload();
  }
}
