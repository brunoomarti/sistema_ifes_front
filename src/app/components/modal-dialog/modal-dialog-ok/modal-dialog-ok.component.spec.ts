import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDialogOkComponent } from './modal-dialog-ok.component';

describe('ModalDialogOkComponent', () => {
  let component: ModalDialogOkComponent;
  let fixture: ComponentFixture<ModalDialogOkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalDialogOkComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalDialogOkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
