import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElementActionBarComponent } from './element-action-bar.component';

describe('ElementActionBarComponent', () => {
  let component: ElementActionBarComponent;
  let fixture: ComponentFixture<ElementActionBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ElementActionBarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ElementActionBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
