import {inject, Injectable, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Champion} from './champion';

@Injectable({
  providedIn: 'root'
})
export class ChampionsService {
  http = inject(HttpClient);
  readonly #championsSignal = signal<Champion[]>([]);
  champions = this.#championsSignal.asReadonly();

  constructor() { }
}
