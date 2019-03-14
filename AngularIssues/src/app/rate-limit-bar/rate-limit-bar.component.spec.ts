import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RateLimitComponentBar } from './rate-limit-bar.component';

describe('RateLimitComponentBar', () => {
  let component: RateLimitComponentBar;
  let fixture: ComponentFixture<RateLimitComponentBar>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RateLimitComponentBar ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RateLimitComponentBar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
