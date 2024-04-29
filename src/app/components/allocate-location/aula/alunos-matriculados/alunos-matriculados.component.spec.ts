import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlunosMatriculadosComponent } from './alunos-matriculados.component';

describe('AlunosMatriculadosComponent', () => {
  let component: AlunosMatriculadosComponent;
  let fixture: ComponentFixture<AlunosMatriculadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlunosMatriculadosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AlunosMatriculadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
