import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatricularAlunoAulaComponent } from './matricular-aluno-aula.component';

describe('MatricularAlunoAulaComponent', () => {
  let component: MatricularAlunoAulaComponent;
  let fixture: ComponentFixture<MatricularAlunoAulaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatricularAlunoAulaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MatricularAlunoAulaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
