import {Component, computed, signal} from '@angular/core';
import {ChampionsService} from '../../champions.service';
import {ItemsService} from '../../items.service';
import {Item} from '../../item';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {toSignal} from '@angular/core/rxjs-interop';
import {debounceTime, distinctUntilChanged} from 'rxjs';

@Component({
  selector: 'app-item-shop',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './item-shop.component.html',
  styleUrl: './item-shop.component.scss'
})
export class ItemShopComponent {
  choiceValidated = signal(false);
  searchControl = new FormControl('');
  selectedSlot = signal<number | null>(null);
  selectedItems = signal<(Item | null)[]>(Array(6).fill(null));
  allItems;

  readonly searchQuery = toSignal(
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ),
    { initialValue: '' }
  );

  filteredItems = computed(() => {
    const query = this.searchQuery()?.toLowerCase() || '';
    return this.allItems().filter(item =>
    item.name.toLowerCase().includes(query)
    );
  });

  constructor(private championService: ChampionsService, itemService: ItemsService) {
    this.choiceValidated = championService.choiceValidated;
    this.allItems = itemService.items;
  }

  onItemClicked(item: Item){
    const slot = this.selectedSlot();
    if (slot !== null){
      const updated = [...this.selectedItems()];
      updated[slot] = item;
      this.selectedItems.set(updated);
      this.selectedSlot.set(null);
    } else {
      const updated = [...this.selectedItems()];
      const firstEmpty = updated.findIndex(i => i === null);
      if (firstEmpty !== -1){
        updated[firstEmpty] = item;
        this.selectedItems.set(updated);
      }
    }
  }

  onSlotClicked(index: number){
    const currentSlot = this.selectedSlot();
    const items= [...this.selectedItems()];

    if (currentSlot === index){
      if (items[index]){
        items[index] = null;
        this.selectedItems.set(items);
      }
      this.selectedSlot.set(null);
    } else {
      this.selectedSlot.set(index);
    }
  }

}
