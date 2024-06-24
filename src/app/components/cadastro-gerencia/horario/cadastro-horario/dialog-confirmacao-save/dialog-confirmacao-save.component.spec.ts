import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogConfirmacaoSaveComponent } from './dialog-confirmacao-save.component';

describe('DialogConfirmacaoSaveComponent', () => {
  let component: DialogConfirmacaoSaveComponent;
  let fixture: ComponentFixture<DialogConfirmacaoSaveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogConfirmacaoSaveComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogConfirmacaoSaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
