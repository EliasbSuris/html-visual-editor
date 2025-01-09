import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResizeHandleDirective } from '../../directives/resize-handle.directive';
import { ElementContainerComponent } from './element-container.component';
import { ResizeElementDirective } from '../../directives/resize-element.directive';
import { ComponentRef } from '@angular/core';

describe('ElementContainerComponent', () => {
  let component: ElementContainerComponent;
  let componentRef: ComponentRef<ElementContainerComponent>;
  let fixture: ComponentFixture<ElementContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ElementContainerComponent, ResizeHandleDirective],
      providers: [ResizeElementDirective]
    }).compileComponents();

    fixture = TestBed.createComponent(ElementContainerComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    componentRef.setInput('zoomLevel', 1);
    componentRef.setInput('resizable', true);
    componentRef.setInput('selectable', true);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
