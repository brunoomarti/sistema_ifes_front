import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewEditEquipComponent } from './new-edit-equip.component';

describe('NewEditEquipComponent', () => {
  let component: NewEditEquipComponent;
  let fixture: ComponentFixture<NewEditEquipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewEditEquipComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewEditEquipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
