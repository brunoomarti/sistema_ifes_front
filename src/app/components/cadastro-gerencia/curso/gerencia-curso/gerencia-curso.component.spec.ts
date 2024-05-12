import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GerenciaCursoComponent } from './gerencia-curso.component';

describe('GerenciaCursoComponent', () => {
  let component: GerenciaCursoComponent;
  let fixture: ComponentFixture<GerenciaCursoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GerenciaCursoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GerenciaCursoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
