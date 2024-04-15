import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EdicaoLocalComponent } from './edicao-local.component';

describe('EdicaoLocalComponent', () => {
  let component: EdicaoLocalComponent;
  let fixture: ComponentFixture<EdicaoLocalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EdicaoLocalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EdicaoLocalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
