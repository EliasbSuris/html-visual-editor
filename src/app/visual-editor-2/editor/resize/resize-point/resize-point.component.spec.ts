import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResizePointComponent } from './resize-point.component';
import { ComponentRef } from '@angular/core';

describe('ResizePointComponent', () => {
  let component: ResizePointComponent;
  let componentRef: ComponentRef<ResizePointComponent>;
  let fixture: ComponentFixture<ResizePointComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResizePointComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ResizePointComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    componentRef.setInput('resizeActionClass', 'e');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
