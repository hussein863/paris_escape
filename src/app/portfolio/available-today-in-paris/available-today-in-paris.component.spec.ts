import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvailableTodayInParisComponent } from './available-today-in-paris.component';

describe('AvailableTodayInParisComponent', () => {
  let component: AvailableTodayInParisComponent;
  let fixture: ComponentFixture<AvailableTodayInParisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvailableTodayInParisComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AvailableTodayInParisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
