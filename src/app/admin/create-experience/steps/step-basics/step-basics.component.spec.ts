import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepBasicsComponent } from './step-basics.component';

describe('StepBasicsComponent', () => {
  let component: StepBasicsComponent;
  let fixture: ComponentFixture<StepBasicsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepBasicsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StepBasicsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
