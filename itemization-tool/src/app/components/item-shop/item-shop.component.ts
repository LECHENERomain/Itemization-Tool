import {Component, computed, signal} from '@angular/core';
import {ChampionsService} from '../../champions.service';
import {ItemsService} from '../../items.service';
import {Item} from '../../item';
import {FormControl, ReactiveFormsModule} from '@angular/forms';

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
  selectedItems = signal<Item[]>(Array(6).fill(null));
  allItems;

  filteredItems = computed(() => {
    const query = this.searchControl.value?.toLowerCase() || '';
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
    } else{
      const updated = [...this.selectedItems()];
      const firstEmpty = updated.findIndex(i => i === null);
      if (firstEmpty !== -1){
        updated[firstEmpty] = item;
        this.selectedItems.set(updated);
      }
    }
  }

  onSlotClicked(index: number){
    if (this.selectedSlot() === index){
      this.selectedSlot.set(null);
    } else{
      this.selectedSlot.set(index);
    }
  }

}
