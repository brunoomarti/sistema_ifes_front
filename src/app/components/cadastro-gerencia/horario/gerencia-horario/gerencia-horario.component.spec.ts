import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GerenciaHorarioComponent } from './gerencia-horario.component';

describe('GerenciaHorarioComponent', () => {
  let component: GerenciaHorarioComponent;
  let fixture: ComponentFixture<GerenciaHorarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GerenciaHorarioComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GerenciaHorarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
