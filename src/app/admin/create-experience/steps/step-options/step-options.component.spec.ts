import { TestBed } from '@angular/core/testing';
import { StepOptionsComponent } from './step-options.component';

describe('StepOptionsComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepOptionsComponent],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(StepOptionsComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
