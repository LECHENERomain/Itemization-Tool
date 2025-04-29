import {inject, Injectable, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Champion} from './champion';

@Injectable({
  providedIn: 'root'
})
export class ChampionsService {
  http = inject(HttpClient);
  readonly #championsSignal = signal<Champion[]>([]);
  readonly champions = this.#championsSignal.asReadonly();
  readonly blueTeam = signal<Champion[]>([]);
  readonly redTeam = signal<Champion[]>([]);

  constructor() {
    this.http.get<Champion[]>('assets/champions.json').subscribe(data => {
      this.#championsSignal.set(data);
    });
  }
}
