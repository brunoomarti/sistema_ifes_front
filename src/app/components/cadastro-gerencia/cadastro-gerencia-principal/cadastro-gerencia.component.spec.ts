import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroGerenciaComponent } from './cadastro-gerencia.component';

describe('CadastroGerenciaComponent', () => {
  let component: CadastroGerenciaComponent;
  let fixture: ComponentFixture<CadastroGerenciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastroGerenciaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CadastroGerenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
