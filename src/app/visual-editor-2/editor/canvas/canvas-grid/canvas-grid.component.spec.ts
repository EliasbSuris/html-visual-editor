import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CanvasGridComponent } from './canvas-grid.component';

describe('CanvasGridComponent', () => {
  let component: CanvasGridComponent;
  let fixture: ComponentFixture<CanvasGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CanvasGridComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(CanvasGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
