import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerHistoricoEventoComponent } from './ver-historico-evento.component';

describe('VerHistoricoEventoComponent', () => {
  let component: VerHistoricoEventoComponent;
  let fixture: ComponentFixture<VerHistoricoEventoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerHistoricoEventoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VerHistoricoEventoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
