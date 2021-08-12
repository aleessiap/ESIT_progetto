import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorizationAssignmentFormComponent } from './authorization-assignment-form.component';

describe('AuthorizationAssignmentFormComponent', () => {
  let component: AuthorizationAssignmentFormComponent;
  let fixture: ComponentFixture<AuthorizationAssignmentFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthorizationAssignmentFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthorizationAssignmentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
