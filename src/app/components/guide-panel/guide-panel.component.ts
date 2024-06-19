import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-guide-panel',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './guide-panel.component.html',
  styleUrl: './guide-panel.component.css'
})
export class GuidePanelComponent {

  userName: string | null = '';

  ngOnInit() {
    this.userName = localStorage.getItem('username');
  }

}
