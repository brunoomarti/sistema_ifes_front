import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroSemestreComponent } from './cadastro-semestre.component';

describe('CadastroSemestreComponent', () => {
  let component: CadastroSemestreComponent;
  let fixture: ComponentFixture<CadastroSemestreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastroSemestreComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CadastroSemestreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
