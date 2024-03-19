import {
  Directive,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  Output,
  Self,
} from '@angular/core';
import { VisorOptions } from '@models/visor-options';
import Panzoom, { PanzoomObject, PanzoomOptions } from '@panzoom/panzoom';
import { Subject, fromEvent, takeUntil } from 'rxjs';

export const DEFAULT_EXCLUDE_CLASS = 'panzoom-exclude';

@Directive({
  selector: '[aorPanZoomVisor]',
  standalone: true,
})
export class PanZoomVisorDirective implements OnInit, OnDestroy {
  @Input()
  options: VisorOptions = {
    disablePan: false,
    disableZoom: false,
    excludeClass: DEFAULT_EXCLUDE_CLASS,
    initialPan: { x: -100, y: -100 },
    initialZoom: 1,
    maxZoom: 5,
    minZoom: 0.5,
    zoomFactor: 0.2,
  };
  @Input()
  panZoomCanvas!: HTMLDivElement;
  @Output()
  zoomLevelChanged = new EventEmitter<number>();

  @Input()
  @HostBinding('style.max-width.px')
  visorMaxWidth!: number;

  panZoom!: PanzoomObject;
  zoomLevel!: number;

  private observer!: ResizeObserver;
  private destroy$ = new Subject<void>();

  constructor(
    @Self() private element: ElementRef,
    private zone: NgZone
  ) {}

  ngOnInit(): void {
    if (!this.panZoomCanvas) {
      throw new Error('panZoomCanvas input should be initializated');
    }
    this.zone.runOutsideAngular(() => {
      this.panZoom = Panzoom(this.panZoomCanvas);
      this.panZoom.setOptions(this.createPanZoomOptions(this.options));
      this.panZoom.zoom(this.options.initialZoom, { animate: true });
      setTimeout(() => this.panZoom.pan(this.options.initialPan.x, this.options.initialPan.y));

      this.subscribeToWheelEvent();
    });
  }

  ngOnDestroy(): void {
    this.observer.unobserve(this.element.nativeElement);
    this.destroy$.next();
    this.destroy$.complete();
  }

  private subscribeToWheelEvent(): void {
    if (!this.options.disableZoom) {
      this.zone.runOutsideAngular(() => {
        fromEvent<WheelEvent>(this.element.nativeElement, 'wheel')
          .pipe(takeUntil(this.destroy$))
          .subscribe((event: WheelEvent) => {
            this.zone.run(() => this.onWheel(event));
          });
      });
    }
  }

  private onWheel(event: WheelEvent): void {
    const zoom = this.panZoom.zoomWithWheel(event);
    this.zoomLevel = zoom.scale;
    this.zoomLevelChanged.next(zoom.scale);
  }

  private createPanZoomOptions(options: VisorOptions): PanzoomOptions {
    return {
      canvas: true,
      // contain: 'outside',
      disablePan: options.disablePan,
      disableZoom: options.disableZoom,
      excludeClass: options.excludeClass,
      maxScale: options.maxZoom,
      minScale: options.minZoom,
      step: options.zoomFactor,
      startScale: options.initialZoom,
    };
  }
}
