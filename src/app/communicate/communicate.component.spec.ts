import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunicateComponent } from './communicate.component';

describe('CommunicateComponent', () => {
  let component: CommunicateComponent;
  let fixture: ComponentFixture<CommunicateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommunicateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommunicateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
