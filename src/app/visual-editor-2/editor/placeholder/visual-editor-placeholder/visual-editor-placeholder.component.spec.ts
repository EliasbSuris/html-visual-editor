import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualEditorPlaceholderComponent } from './visual-editor-placeholder.component';

describe('VisualEditorPlaceholderComponent', () => {
  let component: VisualEditorPlaceholderComponent;
  let fixture: ComponentFixture<VisualEditorPlaceholderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisualEditorPlaceholderComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(VisualEditorPlaceholderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
