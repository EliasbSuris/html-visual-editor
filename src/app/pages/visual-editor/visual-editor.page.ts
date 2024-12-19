import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormField } from '@angular/material/form-field';
import { MatInput, MatLabel } from '@angular/material/input';
import { EditorPlaygroundComponent } from '@components/editor-playground/editor-playground.component';
import { MAP_OBJECTS } from '@components/editor-playground/mock-data';
import { DEFAULT_EXCLUDE_CLASS } from '@directives/pan-zoom-visor.directive';
import { CanvasOptions } from '@models/canvas-options';
import { MapObject } from '@models/map-object.interface';
import { VisorOptions } from '@models/visor-options';

@Component({
  selector: 'page-visual-editor',
  standalone: true,
  imports: [EditorPlaygroundComponent, MatFormField, MatInput, MatLabel, FormsModule],
  templateUrl: './visual-editor.page.html',
  styleUrl: './visual-editor.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VisualEditorPage {
  canvasOptions: CanvasOptions = {
    height: 3000,
    width: 3000,
    backgroundColor: 'rgb(68, 140, 198)',
  };
  visorOptions: VisorOptions = {
    disablePan: false,
    disableZoom: false,
    excludeClass: DEFAULT_EXCLUDE_CLASS,
    initialPan: { x: -100, y: -100 },
    initialZoom: 1,
    maxZoom: 5,
    minZoom: 0.1,
    zoomFactor: 0.5,
  };

  elements = MAP_OBJECTS;

  private cdCounter = 0;

  onChangeCanvasOptions(key: keyof CanvasOptions, value: number): void {
    this.canvasOptions = { ...this.canvasOptions, [key]: value };
  }

  onElementSelected(elementId: string | null): void {
    if (!elementId) {
      console.log('ELEMENT UNSELECTED');
      return;
    }
    const element = this.elements.find(element => element.id === elementId);
    console.log('ELEMENT SELECTED', element);
  }

  onElementMoved(movedElement: MapObject): void {
    // TODO: avoid mutation on drag & drop?
    const element = this.elements.find(element => element.id === movedElement.id);
    console.log('ELEMENT MOVED FROM', element);
    console.log('ELEMENT MOVED TO', movedElement);
  }

  onElementResized(resizedElement: MapObject): void {
    const element = this.elements.find(element => element.id === resizedElement.id);
    console.log('ELEMENT SIZE BEFORE RESIZE', element);
    console.log('ELEMENT SIZE AFTER RESIZE', resizedElement);
  }

  cdFired(): void {
    console.log('%cCD FOR VISUAL EDITOR', 'color: #ffc9c9');
    this.cdCounter++;
    console.log(`%c${this.cdCounter}`, 'color: #ffc9c9; font-size: 18px');
  }
}
