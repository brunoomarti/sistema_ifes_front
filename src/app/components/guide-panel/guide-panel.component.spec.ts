import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuidePanelComponent } from './guide-panel.component';

describe('GuidePanelComponent', () => {
  let component: GuidePanelComponent;
  let fixture: ComponentFixture<GuidePanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuidePanelComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GuidePanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
