import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GerenciaLocalComponent } from './gerencia-local.component';

describe('GerenciaLocalComponent', () => {
  let component: GerenciaLocalComponent;
  let fixture: ComponentFixture<GerenciaLocalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GerenciaLocalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GerenciaLocalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
