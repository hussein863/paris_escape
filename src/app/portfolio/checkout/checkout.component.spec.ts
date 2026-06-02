import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckoutComponent } from './checkout.component';

describe('CheckoutComponent', () => {
  let component: CheckoutComponent;
  let fixture: ComponentFixture<CheckoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should calculate totals correctly', () => {
    expect(component.subtotal).toBe(280);
    expect(component.total).toBeGreaterThan(0);
  });

  it('should increment and decrement adults', () => {
    const initial = component.adultsCount;
    component.incrementAdults();
    expect(component.adultsCount).toBe(initial + 1);
    component.decrementAdults();
    expect(component.adultsCount).toBe(initial);
  });
});
