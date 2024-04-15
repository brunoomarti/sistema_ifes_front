import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GerenciaEventoComponent } from './gerencia-evento.component';

describe('GerenciaEventoComponent', () => {
  let component: GerenciaEventoComponent;
  let fixture: ComponentFixture<GerenciaEventoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GerenciaEventoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GerenciaEventoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
