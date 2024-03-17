import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GerenciaCoordenadorComponent } from './gerencia-coordenador.component';

describe('GerenciaCoordenadorComponent', () => {
  let component: GerenciaCoordenadorComponent;
  let fixture: ComponentFixture<GerenciaCoordenadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GerenciaCoordenadorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GerenciaCoordenadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
