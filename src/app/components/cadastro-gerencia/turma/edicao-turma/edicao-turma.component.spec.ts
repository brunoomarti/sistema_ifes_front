import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EdicaoTurmaComponent } from './edicao-turma.component';

describe('EdicaoTurmaComponent', () => {
  let component: EdicaoTurmaComponent;
  let fixture: ComponentFixture<EdicaoTurmaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EdicaoTurmaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EdicaoTurmaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
