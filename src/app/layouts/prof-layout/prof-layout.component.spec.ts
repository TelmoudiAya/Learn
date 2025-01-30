import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfLayoutComponent } from './prof-layout.component';

describe('ProfLayoutComponent', () => {
  let component: ProfLayoutComponent;
  let fixture: ComponentFixture<ProfLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfLayoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
