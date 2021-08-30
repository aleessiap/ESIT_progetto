import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageDoorsComponent } from './manage-doors.component';

describe('ManageDoorsComponent', () => {
  let component: ManageDoorsComponent;
  let fixture: ComponentFixture<ManageDoorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageDoorsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageDoorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
