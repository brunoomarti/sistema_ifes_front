import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EdicaoAulaComponent } from './edicao-aula.component';

describe('EdicaoAulaComponent', () => {
  let component: EdicaoAulaComponent;
  let fixture: ComponentFixture<EdicaoAulaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EdicaoAulaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EdicaoAulaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
