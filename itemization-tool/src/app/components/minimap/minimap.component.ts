import {Component, effect, signal, AfterViewInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import {ChampionsService} from '../../champions.service';
import {Champion} from '../../champion';
import { CommonModule } from '@angular/common';
import * as fabric from 'fabric';

interface Position{
  x: number;
  y: number;
}

interface Turret{
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
    } else{
      console.error("Canvas element not found");
    }
  }

  selectTool(tool: 'draw' | 'erase' | 'clear' | 'pan'): void {

    if (!this.canvas || !this.drawingCanvas?.nativeElement){
      console.error("MinimapComponent: Canvas or canvas element not initialized");
      return;
    }

    const canvasEl = this.drawingCanvas.nativeElement;

    if (!this.canvas.freeDrawingBrush) {
      this.canvas.freeDrawingBrush = new fabric.PencilBrush(this.canvas);
    }

    if (tool === 'draw'){
      console.log("drawing mode");
      this.canvas.isDrawingMode = true;
      const pen = new fabric.PencilBrush(this.canvas);
      pen.color = 'red';
      pen.width = 2;
      this.canvas.freeDrawingBrush = pen;
      canvasEl.style.pointerEvents = 'auto';
    }else if (tool === 'clear'){
      console.log("clearing canvas");
      this.canvas.clear();
      this.canvas.isDrawingMode = false;
      this.selectTool('pan');
    } else if (tool === 'pan'){
      console.log("panning mode");
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
    { position: { x: 70, y: 555 }, destroyed: false }, // Blue nexus turret 1
    { position: { x: 90, y: 580 }, destroyed: false }, // Blue nexus turret 2
    { position: { x: 45, y: 475 }, destroyed: false }, // Blue top T3
    { position: { x: 60, y: 360 }, destroyed: false }, // Blue top T2
    { position: { x: 35, y: 195 }, destroyed: false }, // Blue top T1
    { position: { x: 160, y: 495 }, destroyed: false }, // Blue mid T3
    { position: { x: 220, y: 445 }, destroyed: false }, // Blue mid T2
    { position: { x: 255, y: 375 }, destroyed: false }, // Blue mid T1
    { position: { x: 185, y: 605 }, destroyed: false }, // Blue bot T3
    { position: { x: 305, y: 595 }, destroyed: false }, // Blue bot T2
    { position: { x: 470, y: 615 }, destroyed: false }, // Blue bot T1
    { position: { x: 560, y: 70 }, destroyed: false }, // Red nexus turret 1
    { position: { x: 580, y: 95 }, destroyed: false }, // Red nexus turret 2
    { position: { x: 465, y: 50 }, destroyed: false }, // Red top T3
    { position: { x: 350, y: 60 }, destroyed: false }, // Red top T2
    { position: { x: 185, y: 40 }, destroyed: false }, // Red top T1
    { position: { x: 495, y: 165 }, destroyed: false }, // Red mid T3
    { position: { x: 430, y: 205 }, destroyed: false }, // Red mid T2
    { position: { x: 395, y: 280 }, destroyed: false }, // Red mid T1
    { position: { x: 605, y: 185 }, destroyed: false }, // Red bot T3
    { position: { x: 595, y: 290 }, destroyed: false }, // Red bot T2
    { position: { x: 615, y: 460 }, destroyed: false } // Red bot T1
  ]

  constructor(private championService: ChampionsService){
    this.blueTeam = championService.blueTeam;
    this.redTeam = championService.redTeam;

    effect(() => {
      this.champPositions.blue.set(this.blueTeam().map((_, i) => ({ x: 20 + i * 40, y: 635 })));
      this.champPositions.red.set(this.redTeam().map((_, i) => ({ x: 450 + i * 40, y: 5 })));
    });
  }

  getPositionStyle(pos: Position): Record<string, string>{
    return {
      left: `${pos.x}px`,
      top: `${pos.y}px`,
    };
  }

  toggleTurret(turret: Turret): void{
    if (this.drawingCanvas?.nativeElement.style.pointerEvents === 'auto') {
      return;
    }
    turret.destroyed = !turret.destroyed;
  }

  dragging: { team: 'blue' | 'red'; index: number } | null = null;

  startDrag(event: MouseEvent, team: 'blue' | 'red', index: number): void{

    if (this.drawingCanvas?.nativeElement.style.pointerEvents === 'auto') {
      return;
    }

    event.preventDefault();
    this.dragging = { team, index };

    const move = (e: MouseEvent) =>{
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
      positions[index] = { x, y };
      this.champPositions[team].set(positions);
    };

    const stop = () =>{
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', stop);
      this.dragging = null;
    };

    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', stop);
  }

  ngOnDestroy(){
    if (this.canvas) this.canvas.dispose();
  }

}
