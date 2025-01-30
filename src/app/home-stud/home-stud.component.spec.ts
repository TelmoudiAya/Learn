import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeStudComponent } from './home-stud.component';

describe('HomeStudComponent', () => {
  let component: HomeStudComponent;
  let fixture: ComponentFixture<HomeStudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeStudComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeStudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
