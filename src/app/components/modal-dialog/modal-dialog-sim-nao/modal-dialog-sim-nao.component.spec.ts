import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDialogSimNaoComponent } from './modal-dialog-sim-nao.component';

describe('ModalDialogSimNaoComponent', () => {
  let component: ModalDialogSimNaoComponent;
  let fixture: ComponentFixture<ModalDialogSimNaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalDialogSimNaoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalDialogSimNaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
