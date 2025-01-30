import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComComponent } from './com.component';

describe('ComComponent', () => {
  let component: ComComponent;
  let fixture: ComponentFixture<ComComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
