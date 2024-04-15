import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroAulaComponent } from './cadastro-aula.component';

describe('CadastroAulaComponent', () => {
  let component: CadastroAulaComponent;
  let fixture: ComponentFixture<CadastroAulaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastroAulaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CadastroAulaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
