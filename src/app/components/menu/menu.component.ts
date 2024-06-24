import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs';
import { SharedService } from '../../shared-services/shared.service';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ModalDialogSimNaoComponent } from '../modal-dialog/modal-dialog-sim-nao/modal-dialog-sim-nao.component';
import { ModalDialogPasswordChangeComponent } from '../modal-dialog/modal-dialog-password-change/modal-dialog-password-change.component';

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
  firstName: string | null = '';
  role: string | null = '';
  tipoUsuario: string | null = '';

  constructor(
    private router: Router,
    private sharedService: SharedService,
    private dialog: MatDialog,
    private dialogPassword: MatDialog
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

      this.firstName = this.userName?.split(' ')[0] ?? '';

      if (this.role === 'STUDENT'){
        this.tipoUsuario = "Aluno";
      } else if (this.role === 'TEACHER'){
        this.tipoUsuario = "Professor";
      } else {
        this.tipoUsuario = "Coordenador";
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
    this.dialog.open(ModalDialogSimNaoComponent, {
      backdropClass: 'backdropTwo'
    });
  }

  passwordChange(){
    this.dialogPassword.open(ModalDialogPasswordChangeComponent, {
      backdropClass: 'backdropTwo'
    });
  }
}
