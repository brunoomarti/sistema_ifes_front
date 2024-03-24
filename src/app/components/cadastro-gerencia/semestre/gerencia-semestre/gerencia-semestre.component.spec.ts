import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GerenciaSemestreComponent } from './gerencia-semestre.component';

describe('GerenciaSemestreComponent', () => {
  let component: GerenciaSemestreComponent;
  let fixture: ComponentFixture<GerenciaSemestreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GerenciaSemestreComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GerenciaSemestreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
