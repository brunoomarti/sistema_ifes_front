import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroCoordenadoriaComponent } from './cadastro-coordenadoria.component';

describe('CadastroCoordenadoriaComponent', () => {
  let component: CadastroCoordenadoriaComponent;
  let fixture: ComponentFixture<CadastroCoordenadoriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastroCoordenadoriaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CadastroCoordenadoriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
