import {Component, effect, signal} from '@angular/core';
import {MatAutocompleteModule, MatOption} from '@angular/material/autocomplete';
import { Champion } from '../../champion';
import {ChampionsService} from '../../champions.service';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {FormControl, ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-team-selector',
  standalone: true,
  imports: [
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatOption,
  ],
  templateUrl: './team-selector.component.html',
  styleUrls: ['./team-selector.component.scss']
})
export class TeamSelectorComponent {
  champions;
  blueTeam = signal<Champion[]>([]);
  redTeam = signal<Champion[]>([]);
  championInputControl = new FormControl('');
  selectedSlot = signal<{ team: 'blue' | 'red', index: number } | null>(null);
  filteredChampions = signal<Champion[]>([]);

  constructor(private championsService: ChampionsService){
    this.champions = championsService.champions;
    this.blueTeam = championsService.blueTeam;
    this.redTeam = championsService.redTeam;

    effect(() =>{
      const allChamps = this.champions();
      if (allChamps.length > 0) {
        this.updateFilteredChampions(this.championInputControl.value ?? '');
      } else {
        this.filteredChampions.set([]);
      }
    });

    this.championInputControl.valueChanges.subscribe(name=>{
      if (typeof name !== 'string') return;

      this.updateFilteredChampions(name);
    });
  }

  selectSlot(team: 'blue' | 'red', index: number) {
    const currentlySelected = this.selectedSlot();
    const isSameSlot = currentlySelected?.team === team && currentlySelected?.index === index;

    if (isSameSlot){
      this.selectedSlot.set(null);
    } else {
      this.selectedSlot.set({team, index});
      this.championInputControl.setValue('');
      this.updateFilteredChampions('');
    }
  }

  updateFilteredChampions(input: string){
    const allChamps = this.champions();

    if (allChamps.length === 0) {
      this.filteredChampions.set([]);
      return;
    }

    const lowerInput = input.toLowerCase();
    const currentBlue = this.blueTeam();
    const currentRed = this.redTeam();
    const selectedNames = new Set([
      ...currentBlue.map(c => c.name),
      ...currentRed.map(c => c.name),
      'Null'
    ]);

    const filtered = allChamps.filter(c =>{
      const hasValidName = typeof c.name === 'string' && c.name.length > 0;
      if (!hasValidName){
        return false;
      }
      return !selectedNames.has(c.name) && c.name.toLowerCase().includes(lowerInput);
    });
    this.filteredChampions.set(filtered);
  }

  onChampionSelected(name: string){
    const champ = this.champions().find(c => c.name === name);
    if (!champ) return;

    const selected = this.selectedSlot();
    if (!selected) return;

    const otherTeam = selected.team === 'blue' ? this.redTeam() : this.blueTeam();
    if (otherTeam.some(c => c.name !== 'Null' && c.name === champ.name)) return;

    if (selected.team === 'blue'){
      const newBlue = [...this.blueTeam()];
      newBlue[selected.index] = champ;
      this.blueTeam.set(newBlue);
    } else {
      const newRed = [...this.redTeam()];
      newRed[selected.index] = champ;
      this.redTeam.set(newRed);
    }

    this.selectedSlot.set(null);
    this.championInputControl.setValue('');
  }

}
