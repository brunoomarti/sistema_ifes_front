import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EdicaoCoordenadoriaComponent } from './edicao-coordenadoria.component';

describe('EdicaoCoordenadoriaComponent', () => {
  let component: EdicaoCoordenadoriaComponent;
  let fixture: ComponentFixture<EdicaoCoordenadoriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EdicaoCoordenadoriaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EdicaoCoordenadoriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
