import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroCoordenadorComponent } from './cadastro-coordenador.component';

describe('CadastroCoordenadorComponent', () => {
  let component: CadastroCoordenadorComponent;
  let fixture: ComponentFixture<CadastroCoordenadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastroCoordenadorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CadastroCoordenadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
