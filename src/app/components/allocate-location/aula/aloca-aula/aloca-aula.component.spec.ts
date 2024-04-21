import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlocaAulaComponent } from './aloca-aula.component';

describe('AlocaAulaComponent', () => {
  let component: AlocaAulaComponent;
  let fixture: ComponentFixture<AlocaAulaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlocaAulaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AlocaAulaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
