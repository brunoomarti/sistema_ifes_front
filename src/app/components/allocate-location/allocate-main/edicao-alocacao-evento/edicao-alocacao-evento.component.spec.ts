import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EdicaoAlocacaoEventoComponent } from './edicao-alocacao-evento.component';

describe('EdicaoAlocacaoEventoComponent', () => {
  let component: EdicaoAlocacaoEventoComponent;
  let fixture: ComponentFixture<EdicaoAlocacaoEventoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EdicaoAlocacaoEventoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EdicaoAlocacaoEventoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
