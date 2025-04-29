import {Component, signal} from '@angular/core';
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
  champions = signal<Champion[]>([]).asReadonly();
  blueTeam = signal<Champion[]>([]);
  redTeam = signal<Champion[]>([]);
  championInputControl = new FormControl('');

  constructor(private championsService: ChampionsService){
    this.champions = championsService.champions;
    this.championInputControl.valueChanges.subscribe(name => {

      if (!name) return;

      const champ = this.champions().find(c => c.name === name);
      if (!champ) return;

      const currentBlue = this.blueTeam();
      const currentRed = this.redTeam();

      if (
        currentBlue.some(c => c.name === champ.name) ||
        currentRed.some(c => c.name === champ.name)
      ) {
        return;
      }
      if (currentBlue.length < 5) {
        this.blueTeam.set([...currentBlue, champ]);
      } else if (currentRed.length < 5) {
        this.redTeam.set([...currentRed, champ]);
      }

      this.championInputControl.setValue('');
    });
  }

  onChampionSelected(name: string){
    const champ = this.champions().find(c => c.name === name);
    if (!champ) return;

    const currentBlue = this.blueTeam();
    const currentRed = this.redTeam();

    if (
      currentBlue.some(c => c.name === champ.name) ||
      currentRed.some(c => c.name === champ.name)
    ) {
      return;
    }
    if (currentBlue.length < 5) {
      this.blueTeam.set([...currentBlue, champ]);
    } else if (currentRed.length < 5) {
      this.redTeam.set([...currentRed, champ]);
    }

    this.championInputControl.setValue('');
  }

}
