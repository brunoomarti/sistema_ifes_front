import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GerenciaDisciplinaComponent } from './gerencia-disciplina.component';

describe('GerenciaDisciplinaComponent', () => {
  let component: GerenciaDisciplinaComponent;
  let fixture: ComponentFixture<GerenciaDisciplinaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GerenciaDisciplinaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GerenciaDisciplinaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
