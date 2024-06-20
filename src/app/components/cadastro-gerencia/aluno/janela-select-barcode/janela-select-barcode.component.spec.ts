import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JanelaSelectBarcodeComponent } from './janela-select-barcode.component';

describe('JanelaSelectBarcodeComponent', () => {
  let component: JanelaSelectBarcodeComponent;
  let fixture: ComponentFixture<JanelaSelectBarcodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JanelaSelectBarcodeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(JanelaSelectBarcodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
