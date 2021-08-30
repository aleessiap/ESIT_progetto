import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDoorFormComponent } from './add-door-form.component';

describe('AddDoorFormComponent', () => {
  let component: AddDoorFormComponent;
  let fixture: ComponentFixture<AddDoorFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddDoorFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDoorFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
