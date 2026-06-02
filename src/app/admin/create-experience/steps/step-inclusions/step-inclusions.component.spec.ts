import { TestBed } from '@angular/core/testing';
import { StepInclusionsComponent } from './step-inclusions.component';

describe('StepInclusionsComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepInclusionsComponent],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(StepInclusionsComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
