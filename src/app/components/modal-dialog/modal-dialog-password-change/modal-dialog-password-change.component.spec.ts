import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDialogPasswordChangeComponent } from './modal-dialog-password-change.component';

describe('ModalDialogPasswordChangeComponent', () => {
  let component: ModalDialogPasswordChangeComponent;
  let fixture: ComponentFixture<ModalDialogPasswordChangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalDialogPasswordChangeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalDialogPasswordChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
