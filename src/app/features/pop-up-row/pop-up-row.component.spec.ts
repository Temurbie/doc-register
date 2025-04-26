import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopUpRowComponent } from './pop-up-row.component';

describe('PopUpRowComponent', () => {
  let component: PopUpRowComponent;
  let fixture: ComponentFixture<PopUpRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopUpRowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopUpRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
