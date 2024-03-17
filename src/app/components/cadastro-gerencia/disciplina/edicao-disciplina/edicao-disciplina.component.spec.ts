import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EdicaoDisciplinaComponent } from './edicao-disciplina.component';

describe('EdicaoDisciplinaComponent', () => {
  let component: EdicaoDisciplinaComponent;
  let fixture: ComponentFixture<EdicaoDisciplinaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EdicaoDisciplinaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EdicaoDisciplinaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
