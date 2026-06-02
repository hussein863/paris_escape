import { TestBed } from '@angular/core/testing';
import { StepPricingComponent } from './step-pricing.component';

describe('StepPricingComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepPricingComponent],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(StepPricingComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
