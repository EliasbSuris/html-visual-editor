import { Directive, ElementRef, Input, NgZone, OnDestroy, OnInit, output, Self } from '@angular/core';
import Panzoom, { PanzoomObject, PanzoomOptions } from '@panzoom/panzoom';
import { fromEvent, Subject, takeUntil } from 'rxjs';
import { VisorOptions } from '../visor/visor-options';

// Elements with this class will be excluded from Panzoom lib handling
export const DEFAULT_EXCLUDE_CLASS = 'panzoom-exclude';

/**
 * Element that is used as a visor on Panzoom.js implementation. Requires another element to be used as a canvas(gesPanZoomRootElement).
 * The visor will capture mouse wheel events to change zoom level, and the canvas will be used as a root element for Panzoom.js lib.
 */
@Directive({
  selector: '[aorPanZoom]',
})
export class PanZoomDirective implements OnInit, OnDestroy {
  /** **(REQUIRED)** HTML element used to initialize Panzoom.js lib. */
  @Input('aorPanZoomRootElement')
  public rootElement!: HTMLElement;

  /** Emits when Panzoom.js zoom (scale) changes. */
  public zoomLevelChanged = output<number>({ alias: 'aorPanZoomZoomLevelChanged' });

  public panZoom!: PanzoomObject;

  private destroy$ = new Subject<void>();
  private panZoomOptions!: PanzoomOptions;
  private _visorOptions: VisorOptions = {
    disablePan: false,
    disableZoom: false,
    initialPan: { x: 0, y: 0 },
    initialZoom: 1,
    maxZoom: 5,
    minZoom: 0.5,
    zoomFactor: 0.5,
  };

  constructor(
    @Self() private element: ElementRef,
    private zone: NgZone
  ) {}

  /** Options to configure Panzoom.js lib creating a PanzoomOptions object. */
  @Input('aorPanZoomOptions')
  public set options(options: VisorOptions) {
    if (!options) {
      return;
    }
    this._visorOptions = options;
    this.panZoomOptions = this.createPanZoomOptions(options);
    if (this.panZoom) {
      this.panZoom.setOptions(this.panZoomOptions);
    }
  }

  ngOnInit(): void {
    if (!this.rootElement) {
      throw new Error('gesPanZoomRootElement input should be initializated');
    }
    this.zone.runOutsideAngular(() => {
      this.panZoom = Panzoom(this.rootElement);
      if (!this.panZoomOptions) {
        this.panZoomOptions = this.createPanZoomOptions(this._visorOptions);
      }
      this.panZoom.setOptions(this.panZoomOptions);
      this.panZoom.zoom(this._visorOptions.initialZoom, { animate: true });
      // https://github.com/timmywil/panzoom?tab=readme-ov-file#a-note-on-the-async-nature-of-panzoom
      setTimeout(() => this.panZoom.pan(this._visorOptions.initialPan.x, this._visorOptions.initialPan.y));
      this.runChangeZoomLevel(this.panZoom.getScale());

      this.subscribeToWheelEvent();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Pan to (x,y) coordinates.
   * Pan applies a traslate, so coordinates works on inverse mode.
   * Negative values pull canvas to the left/top, and positive values push canvas to the right/bottom.
   *
   * @param x coordinate.
   * @param y coordinate.
   */
  public panTo({ x, y }: { x: number | string; y: number | string }): void {
    this.zone.runOutsideAngular(() => {
      if (this.panZoom.getScale() !== 1) {
        /*
          Only on scale 1, top left corner pan coordinates are (0,0).
          On scale 1 element position coordinates will match pan coordinates.
        */
        this.panZoom.zoom(1);
        this.runChangeZoomLevel(this.panZoom.getScale());
      }
      setTimeout(() => this.panZoom.pan(x, y, { animate: true }));
    });
  }

  public reset(): void {
    this.zone.runOutsideAngular(() => {
      this.panZoom.reset();
      this.runChangeZoomLevel(this.panZoom.getScale());
    });
  }

  public zoomIn(): void {
    this.zone.runOutsideAngular(() => {
      this.panZoom.zoomIn();
      this.runChangeZoomLevel(this.panZoom.getScale());
    });
  }

  public zoomOut(): void {
    this.zone.runOutsideAngular(() => {
      this.panZoom.zoomOut();
      this.runChangeZoomLevel(this.panZoom.getScale());
    });
  }

  private subscribeToWheelEvent(): void {
    this.zone.runOutsideAngular(() => {
      fromEvent<WheelEvent>(this.element.nativeElement, 'wheel')
        .pipe(takeUntil(this.destroy$))
        .subscribe((event: WheelEvent) => {
          this.zone.run(() => this.onWheel(event));
        });
    });
  }

  private onWheel(event: WheelEvent): void {
    if (!event.ctrlKey) {
      return;
    }
    const zoom = this.panZoom.zoomWithWheel(event);
    // If scale is 0 element will be hidden, so can't be 0.
    if (zoom?.scale) {
      this.changeZoomLevel(zoom.scale);
    }
  }

  private createPanZoomOptions(options: VisorOptions): PanzoomOptions {
    return {
      canvas: false,
      disablePan: options.disablePan,
      disableZoom: options.disableZoom,
      excludeClass: DEFAULT_EXCLUDE_CLASS,
      maxScale: options.maxZoom,
      minScale: options.minZoom,
      step: options.zoomFactor,
      startScale: options.initialZoom,
      startX: options.initialPan.x,
      startY: options.initialPan.y,
    };
  }

  private changeZoomLevel(newZoomLevel: number): void {
    this.zoomLevelChanged.emit(newZoomLevel);
  }

  private runChangeZoomLevel(newZoomLevel: number): void {
    this.zone.run(() => this.zoomLevelChanged.emit(newZoomLevel));
  }
}
