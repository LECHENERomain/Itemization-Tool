import {inject, Injectable, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Item} from './item';
import {map, take} from 'rxjs';

interface RawItemData {
  name: string;
  description: string;
  gold: {
    base: number;
    purchasable: boolean;
    total: number;
    sell: number;
  };
  image: {
    full: string;
    sprite: string;
    group: string;
    x: number;
    y: number;
    w: number;
    h: number;
  };
  stats: Record<string, number>;
  tags: string[];
  from?: string[];
  into?: string[];
  depth?: number;
  requiredChampion?: string;
  colloq?: string;
  plaintext?: string;
  consumed?: boolean;
  stacks?: number;
  consumeOnFull?: boolean;
  specialRecipe?: number;
  inStore?: boolean;
  hideFromAll?: boolean;
  requiredAlly?: string;
  maps?: Record<string, boolean>;
  effect?: any;
}

interface ItemsApiResponse {
  type: string;
  version: string;
  basic: any;
  data: { [key: string]: RawItemData };
  groups: any[];
  tree: any[];
}

@Injectable({
  providedIn: 'root'
})
export class ItemsService {
  http = inject(HttpClient);
  readonly #itemsSignal = signal<Item[]>([]);
  readonly items = this.#itemsSignal.asReadonly();

  constructor() {
    this.http.get<ItemsApiResponse>('assets/items.json')
      .pipe(
        take(1),
        map(response => {
          const itemData = response.data;
          const gameVersion = response.version;
          const rawItemsWithKeys = Object.entries(itemData);

          return rawItemsWithKeys.map(([itemId, rawItem]) => {
            return {
              id: itemId,
              name: rawItem.name,
              description: rawItem.description,
              icon: `https://ddragon.leagueoflegends.com/cdn/${gameVersion}/img/item/${itemId}.png`,
              stats: rawItem.stats,
              goldCost: rawItem.gold.total,
              tags: rawItem.tags,
              from: rawItem.from,
              into: rawItem.into,
              depth: rawItem.depth,
              requiredChampion: rawItem.requiredChampion,
            } as Item;
          })
        })
      )
      .subscribe(data => {
        this.#itemsSignal.set(data);
        console.log("Items loaded successfully:", data.length);
      }, error => {
        console.error("Failed to fetch or process items.json:", error);
        this.#itemsSignal.set([]);
      });
  }
}
