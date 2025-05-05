import {inject, Injectable, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Item} from './item';

@Injectable({
  providedIn: 'root'
})
export class ItemsService {
  http = inject(HttpClient);
  readonly #itemsSignal = signal<Item[]>([]);
  readonly items = this.#itemsSignal.asReadonly();

  constructor() {
    this.http.get<Item[]>('assets/items.json')
      .subscribe(data => {
        this.#itemsSignal.set(data);
      }, error => {
        console.error("Failed to fetch items.json:", error);
        this.#itemsSignal.set([]);
      });
  }
}
