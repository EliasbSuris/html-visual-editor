import { Component } from '@angular/core';
import { EditorPlaygroundComponent } from '@components/editor-playground/editor-playground.component';

@Component({
  selector: 'page-visual-editor',
  standalone: true,
  imports: [EditorPlaygroundComponent],
  templateUrl: './visual-editor.page.html',
  styleUrl: './visual-editor.page.scss',
})
export class VisualEditorPage {}
