import {Component, effect, signal} from '@angular/core';
import {ChampionsService} from '../../champions.service';
import {Champion} from '../../champion';
import { CommonModule } from '@angular/common';

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
export class MinimapComponent {
  blueTeam = signal<Champion[]>([]);
  redTeam = signal<Champion[]>([]);

  champPositions = {
    blue: signal<Position[]>([]),
    red: signal<Position[]>([])
  };

  turrets: Turret[] = [
    { position: { x: 50, y: 450 }, destroyed: false },
    { position: { x: 100, y: 400 }, destroyed: false },
    { position: { x: 450, y: 50 }, destroyed: false },
    { position: { x: 400, y: 100 }, destroyed: false },
  ]

  constructor(private championService: ChampionsService){
    this.blueTeam = championService.blueTeam;
    this.redTeam = championService.redTeam;

    effect(() => {
      this.champPositions.blue.set(this.blueTeam().map((_, i) => ({ x: 20, y: 420 - i * 40 })));
      this.champPositions.red.set(this.redTeam().map((_, i) => ({ x: 460, y: 20 + i * 40 })));
    });
  }

  getPositionStyle(pos: Position): Record<string, string>{
    return {
      left: `${pos.x}px`,
      top: `${pos.y}px`,
    };
  }

  toggleTurret(turret: Turret): void{
    turret.destroyed = !turret.destroyed;
  }

  dragging: { team: 'blue' | 'red'; index: number } | null = null;

  startDrag(event: MouseEvent, team: 'blue' | 'red', index: number): void{
    event.preventDefault();
    this.dragging = { team, index };

    const move = (e: MouseEvent) =>{
      if (!this.dragging) return;

      const rect = (event.target as HTMLElement).closest('.minimap-container')!.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

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

}
