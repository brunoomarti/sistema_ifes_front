import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllocateLocationComponent } from './allocate-location.component';

describe('AllocateLocationComponent', () => {
  let component: AllocateLocationComponent;
  let fixture: ComponentFixture<AllocateLocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllocateLocationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AllocateLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
