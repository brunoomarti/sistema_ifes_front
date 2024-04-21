import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlocaEventoComponent } from './aloca-evento.component';

describe('AlocaEventoComponent', () => {
  let component: AlocaEventoComponent;
  let fixture: ComponentFixture<AlocaEventoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlocaEventoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AlocaEventoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
