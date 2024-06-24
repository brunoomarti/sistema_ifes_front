import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogHorarioComponent } from './dialog-horario.component';

describe('DialogHorarioComponent', () => {
  let component: DialogHorarioComponent;
  let fixture: ComponentFixture<DialogHorarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogHorarioComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogHorarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
