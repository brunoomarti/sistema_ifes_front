import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs';
import { SharedService } from '../../shared-services/shared.service';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css', '/src/styles.css']
})

export class MenuComponent implements OnInit {

  selectedButton: number = 0;
  userName: string | null = '';
  role: string | null = '';
  tipoUsuario: string | null = '';

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

      if (typeof localStorage !== 'undefined'){
        this.userName = localStorage.getItem('username');
        this.role = localStorage.getItem("role");
      }

      if (this.role === 'STUDENT'){
        this.tipoUsuario = "Aluno";
      } else if (this.role === 'TEACHER'){
        this.tipoUsuario = "Professor";
      } else {
        this.tipoUsuario = "Coordenador de Curso";
      }
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
    localStorage.removeItem("role");
    localStorage.removeItem("student_code");
    window.location.reload();
  }
}
