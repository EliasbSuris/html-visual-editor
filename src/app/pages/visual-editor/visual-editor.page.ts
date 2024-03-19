import { Component } from '@angular/core';
import { EditorPlaygroundComponent } from '@components/editor-playground/editor-playground.component';
import { DEFAULT_EXCLUDE_CLASS } from '@directives/pan-zoom-visor.directive';
import { CanvasOptions } from '@models/canvas-options';
import { VisorOptions } from '@models/visor-options';

@Component({
  selector: 'page-visual-editor',
  standalone: true,
  imports: [EditorPlaygroundComponent],
  templateUrl: './visual-editor.page.html',
  styleUrl: './visual-editor.page.scss',
})
export class VisualEditorPage {
  canvasOptions: CanvasOptions = {
    height: 1000,
    width: 1000,
  };
  visorOptions: VisorOptions = {
    disablePan: false,
    disableZoom: false,
    excludeClass: DEFAULT_EXCLUDE_CLASS,
    initialPan: { x: -100, y: -100 },
    initialZoom: 1,
    maxZoom: 10,
    minZoom: 0.1,
    zoomFactor: 0.5,
  };
}
