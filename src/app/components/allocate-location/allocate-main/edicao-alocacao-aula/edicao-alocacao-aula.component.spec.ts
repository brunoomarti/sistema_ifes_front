import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EdicaoAlocacaoAulaComponent } from './edicao-alocacao-aula.component';

describe('EdicaoAlocacaoAulaComponent', () => {
  let component: EdicaoAlocacaoAulaComponent;
  let fixture: ComponentFixture<EdicaoAlocacaoAulaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EdicaoAlocacaoAulaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EdicaoAlocacaoAulaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
