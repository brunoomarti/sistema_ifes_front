import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EdicaoSemestreComponent } from './edicao-semestre.component';

describe('EdicaoSemestreComponent', () => {
  let component: EdicaoSemestreComponent;
  let fixture: ComponentFixture<EdicaoSemestreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EdicaoSemestreComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EdicaoSemestreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
