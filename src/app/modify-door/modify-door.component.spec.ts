import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyDoorComponent } from './modify-door.component';

describe('ModifyDoorComponent', () => {
  let component: ModifyDoorComponent;
  let fixture: ComponentFixture<ModifyDoorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModifyDoorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifyDoorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
