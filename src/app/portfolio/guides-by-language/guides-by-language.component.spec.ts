import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuidesByLanguageComponent } from './guides-by-language.component';

describe('GuidesByLanguageComponent', () => {
  let component: GuidesByLanguageComponent;
  let fixture: ComponentFixture<GuidesByLanguageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuidesByLanguageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GuidesByLanguageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
