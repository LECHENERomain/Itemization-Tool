import {inject, Injectable, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Champion, NULL_CHAMPION} from './champion';
import {take} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChampionsService {
  http = inject(HttpClient);
  readonly #championsSignal = signal<Champion[]>([]);
  readonly champions = this.#championsSignal.asReadonly();
  readonly blueTeam = signal<Champion[]>([NULL_CHAMPION, NULL_CHAMPION, NULL_CHAMPION, NULL_CHAMPION, NULL_CHAMPION]);
  readonly redTeam = signal<Champion[]>([NULL_CHAMPION, NULL_CHAMPION, NULL_CHAMPION, NULL_CHAMPION, NULL_CHAMPION]);
  readonly locked = signal(false);
  readonly choiceValidated = signal(false);

  constructor() {
    this.http.get<Champion[]>('assets/champions.json')
      .pipe(take(1))
      .subscribe(data => {
        this.#championsSignal.set(data);
      }, error => {
        console.error("Failed to fetch champions.json:", error);
        this.#championsSignal.set([]);
      });
  }
}
