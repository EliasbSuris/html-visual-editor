import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualEditorComponent } from './visual-editor.component';
import { ComponentRef } from '@angular/core';

describe('VisualEditorComponent', () => {
  let component: VisualEditorComponent;
  let componentRef: ComponentRef<VisualEditorComponent>;
  let fixture: ComponentFixture<VisualEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisualEditorComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(VisualEditorComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    componentRef.setInput('canvasOptions', null);
    componentRef.setInput('visorOptions', null);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
