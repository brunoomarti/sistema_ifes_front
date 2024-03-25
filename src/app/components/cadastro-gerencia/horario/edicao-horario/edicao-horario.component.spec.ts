import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EdicaoHorarioComponent } from './edicao-horario.component';

describe('EdicaoHorarioComponent', () => {
  let component: EdicaoHorarioComponent;
  let fixture: ComponentFixture<EdicaoHorarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EdicaoHorarioComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EdicaoHorarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
