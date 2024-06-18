import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { MenuComponent } from './components/menu/menu.component';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {  HTTP_INTERCEPTORS, HttpClientModule, withInterceptors } from '@angular/common/http';
import { provideHttpClient, withFetch } from '@angular/common/http'; 
import { JwtInterceptor } from './components/login/service/jwt-inteceptor';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatIconModule,
    RouterModule,
    AppComponent,
    MenuComponent,
    MatDialogModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserModule
  ],
  providers: [
    provideHttpClient(withInterceptors([JwtInterceptor]))
  ],
})
export class AppModule { }
