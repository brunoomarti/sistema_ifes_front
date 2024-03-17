import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroLocalComponent } from './cadastro-local.component';

describe('CadastroLocalComponent', () => {
  let component: CadastroLocalComponent;
  let fixture: ComponentFixture<CadastroLocalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastroLocalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CadastroLocalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
