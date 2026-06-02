import { TestBed } from '@angular/core/testing';
import { StepAvailabilityComponent } from './step-availability.component';

describe('StepAvailabilityComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepAvailabilityComponent],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(StepAvailabilityComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
