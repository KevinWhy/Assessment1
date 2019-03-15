import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IssueUserComponent } from './issue-user.component';

describe('IssueUserComponent', () => {
  let component: IssueUserComponent;
  let fixture: ComponentFixture<IssueUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IssueUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IssueUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
