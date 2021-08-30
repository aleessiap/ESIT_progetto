import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileDataFormComponent } from './profile-data-form.component';

describe('ProfileDataFormComponent', () => {
  let component: ProfileDataFormComponent;
  let fixture: ComponentFixture<ProfileDataFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfileDataFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileDataFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
