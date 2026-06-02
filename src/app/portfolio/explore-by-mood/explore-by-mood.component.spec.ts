import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExploreByMoodComponent } from './explore-by-mood.component';

describe('ExploreByMoodComponent', () => {
  let component: ExploreByMoodComponent;
  let fixture: ComponentFixture<ExploreByMoodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExploreByMoodComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ExploreByMoodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
