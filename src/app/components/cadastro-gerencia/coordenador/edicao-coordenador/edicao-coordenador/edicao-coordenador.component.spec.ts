import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EdicaoCoordenadorComponent } from './edicao-coordenador.component';

describe('EdicaoCoordenadorComponent', () => {
  let component: EdicaoCoordenadorComponent;
  let fixture: ComponentFixture<EdicaoCoordenadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EdicaoCoordenadorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EdicaoCoordenadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
