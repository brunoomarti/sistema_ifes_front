import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GerenciaCoordenadoriaComponent } from './gerencia-coordenadoria.component';

describe('GerenciaCoordenadoriaComponent', () => {
  let component: GerenciaCoordenadoriaComponent;
  let fixture: ComponentFixture<GerenciaCoordenadoriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GerenciaCoordenadoriaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GerenciaCoordenadoriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
