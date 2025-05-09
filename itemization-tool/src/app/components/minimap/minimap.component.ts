import {Component, effect, signal, AfterViewInit, ElementRef, ViewChild, OnDestroy} from '@angular/core';
import {ChampionsService} from '../../champions.service';
import {Champion} from '../../champion';
import {CommonModule} from '@angular/common';
import * as fabric from 'fabric';

interface Position {
  x: number;
  y: number;
}

interface Turret {
  position: Position;
  destroyed: boolean;
}

@Component({
  selector: 'app-minimap',
  imports: [
    CommonModule,
  ],
  templateUrl: './minimap.component.html',
  styleUrl: './minimap.component.scss'
})
export class MinimapComponent implements AfterViewInit, OnDestroy {
  @ViewChild('drawingCanvas') drawingCanvas!: ElementRef<HTMLCanvasElement>
  private canvas!: fabric.Canvas;
  blueTeam = signal<Champion[]>([]);
  redTeam = signal<Champion[]>([]);

  ngAfterViewInit() {
    console.log("ngAfterViewInit called");
    if (this.drawingCanvas?.nativeElement) {
      console.log("Canvas element found");
      this.canvas = new fabric.Canvas(this.drawingCanvas.nativeElement, {
        isDrawingMode: false,
        backgroundColor: '',
      });

      this.canvas.freeDrawingBrush = new fabric.PencilBrush(this.canvas);
      this.canvas.freeDrawingBrush!.width = 2;
      this.canvas.freeDrawingBrush!.color = 'red';

      this.selectTool('pan');
    } else {
      console.error("Canvas element not found");
    }
  }

  selectTool(tool: 'draw' | 'clear' | 'pan'): void {

    if (!this.canvas || !this.drawingCanvas?.nativeElement) {
      console.error("MinimapComponent: Canvas or canvas element not initialized");
      return;
    }

    const canvasEl = this.drawingCanvas.nativeElement;

    if (!this.canvas.freeDrawingBrush) {
      this.canvas.freeDrawingBrush = new fabric.PencilBrush(this.canvas);
    }

    if (tool === 'draw') {
      this.canvas.isDrawingMode = true;
      const pen = new fabric.PencilBrush(this.canvas);
      pen.color = 'yellow';
      pen.width = 2;
      this.canvas.freeDrawingBrush = pen;
    } else if (tool === 'clear') {
      this.canvas.clear();
      this.canvas.isDrawingMode = false;
      this.selectTool('pan');
    } else if (tool === 'pan') {
      this.canvas.isDrawingMode = false;
      canvasEl.style.pointerEvents = 'none';
    }

    this.canvas.renderAll();
  }

  champPositions = {
    blue: signal<Position[]>([]),
    red: signal<Position[]>([])
  };

  turrets: Turret[] = [
    {position: {x: 65, y: 535}, destroyed: false}, // Blue nexus turret 1
    {position: {x: 85, y: 560}, destroyed: false}, // Blue nexus turret 2
    {position: {x: 40, y: 450}, destroyed: false}, // Blue top T3
    {position: {x: 55, y: 345}, destroyed: false}, // Blue top T2
    {position: {x: 35, y: 180}, destroyed: false}, // Blue top T1
    {position: {x: 155, y: 475}, destroyed: false}, // Blue mid T3
    {position: {x: 210, y: 425}, destroyed: false}, // Blue mid T2
    {position: {x: 245, y: 355}, destroyed: false}, // Blue mid T1
    {position: {x: 180, y: 585}, destroyed: false}, // Blue bot T3
    {position: {x: 290, y: 570}, destroyed: false}, // Blue bot T2
    {position: {x: 445, y: 590}, destroyed: false}, // Blue bot T1
    {position: {x: 535, y: 70}, destroyed: false}, // Red nexus turret 1
    {position: {x: 555, y: 85}, destroyed: false}, // Red nexus turret 2
    {position: {x: 445, y: 45}, destroyed: false}, // Red top T3
    {position: {x: 335, y: 50}, destroyed: false}, // Red top T2
    {position: {x: 180, y: 35}, destroyed: false}, // Red top T1
    {position: {x: 470, y: 150}, destroyed: false}, // Red mid T3
    {position: {x: 415, y: 195}, destroyed: false}, // Red mid T2
    {position: {x: 375, y: 265}, destroyed: false}, // Red mid T1
    {position: {x: 580, y: 180}, destroyed: false}, // Red bot T3
    {position: {x: 565, y: 280}, destroyed: false}, // Red bot T2
    {position: {x: 590, y: 440}, destroyed: false} // Red bot T1
  ]

  constructor(private championService: ChampionsService) {
    this.blueTeam = championService.blueTeam;
    this.redTeam = championService.redTeam;

    effect(() => {
      this.champPositions.blue.set(this.blueTeam().map((_, i) => ({x: 20 + i * 40, y: 635})));
      this.champPositions.red.set(this.redTeam().map((_, i) => ({x: 450 + i * 40, y: 5})));
    });
  }

  getPositionStyle(pos: Position): Record<string, string> {
    return {
      left: `${pos.x}px`,
      top: `${pos.y}px`,
    };
  }

  toggleTurret(turret: Turret): void {
    if (this.drawingCanvas?.nativeElement.style.pointerEvents === 'auto') {
      return;
    }
    turret.destroyed = !turret.destroyed;
  }

  dragging: { team: 'blue' | 'red'; index: number } | null = null;

  startDrag(event: MouseEvent, team: 'blue' | 'red', index: number): void {

    if (this.drawingCanvas?.nativeElement.style.pointerEvents === 'auto') {
      return;
    }

    event.preventDefault();
    this.dragging = {team, index};

    const move = (e: MouseEvent) => {
      if (!this.dragging) return;

      const minimapContainer = (event.target as HTMLElement).closest('.minimap-container');
      if (!minimapContainer) return;

      const rect = minimapContainer.getBoundingClientRect();

      let x = e.clientX - rect.left;
      let y = e.clientY - rect.top;

      const canvasWidth = 650;
      const canvasHeight = 650;
      const iconWidth = 48;
      const iconHeight = 48;

      x = Math.max(0, Math.min(x - iconWidth / 2, canvasWidth - iconWidth));
      y = Math.max(0, Math.min(y - iconHeight / 2, canvasHeight - iconHeight));

      const positions = [...this.champPositions[team]()];
      positions[index] = {x, y};
      this.champPositions[team].set(positions);
    };

    const stop = () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', stop);
      this.dragging = null;
    };

    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', stop);
  }

  ngOnDestroy() {
    if (this.canvas) this.canvas.dispose();
  }

}
