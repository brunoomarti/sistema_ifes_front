import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GerenciaTurmaComponent } from './gerencia-turma.component';

describe('GerenciaTurmaComponent', () => {
  let component: GerenciaTurmaComponent;
  let fixture: ComponentFixture<GerenciaTurmaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GerenciaTurmaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GerenciaTurmaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
