import { TestBed } from '@angular/core/testing';
import { StepPoliciesComponent } from './step-policies.component';

describe('StepPoliciesComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepPoliciesComponent],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(StepPoliciesComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
