import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GerenciaAulaComponent } from './gerencia-aula.component';

describe('GerenciaAulaComponent', () => {
  let component: GerenciaAulaComponent;
  let fixture: ComponentFixture<GerenciaAulaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GerenciaAulaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GerenciaAulaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
