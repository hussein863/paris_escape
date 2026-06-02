import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopularExperiencesComponent } from './popular-experiences.component';

describe('PopularExperiencesComponent', () => {
  let component: PopularExperiencesComponent;
  let fixture: ComponentFixture<PopularExperiencesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopularExperiencesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PopularExperiencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
