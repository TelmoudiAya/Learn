import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InscritComponent } from './inscrit.component';

describe('InscritComponent', () => {
  let component: InscritComponent;
  let fixture: ComponentFixture<InscritComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InscritComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InscritComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
