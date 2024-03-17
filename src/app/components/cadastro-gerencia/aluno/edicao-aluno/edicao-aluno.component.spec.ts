import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EdicaoAlunoComponent } from './edicao-aluno.component';

describe('EdicaoAlunoComponent', () => {
  let component: EdicaoAlunoComponent;
  let fixture: ComponentFixture<EdicaoAlunoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EdicaoAlunoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EdicaoAlunoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
