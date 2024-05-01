import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerHistoricoAulaComponent } from './ver-historico-aula.component';

describe('VerHistoricoAulaComponent', () => {
  let component: VerHistoricoAulaComponent;
  let fixture: ComponentFixture<VerHistoricoAulaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerHistoricoAulaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VerHistoricoAulaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
