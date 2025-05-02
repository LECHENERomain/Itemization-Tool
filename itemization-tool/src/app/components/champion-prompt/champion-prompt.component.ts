import {Component, computed, signal, WritableSignal} from '@angular/core';
import {ChampionsService} from '../../champions.service';
import {Champion, NULL_CHAMPION} from '../../champion';
import {ReactiveFormsModule, FormControl} from '@angular/forms';
import {MatAutocomplete, MatAutocompleteModule, MatOption} from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';


@Component({
  selector: 'app-champion-prompt',
  imports: [
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatOption,
    MatAutocomplete,
    MatFormFieldModule,
    MatInput
  ],
  templateUrl: './champion-prompt.component.html',
  styleUrl: './champion-prompt.component.scss'
})
export class ChampionPromptComponent {
  championControl = new FormControl('');
  selectedChampions = signal<Champion[]>([]);
  selectedChampion = signal<Champion | null>(null);
  locked: WritableSignal<boolean>;
  validatedChoice: WritableSignal<boolean>;

  constructor(private championsService: ChampionsService) {
    this.locked = championsService.locked;
    this.validatedChoice = championsService.choiceValidated;
  }

  get teamChampions(): Champion[]{
    return [...this.championsService.blueTeam(), ...this.championsService.redTeam()];
  }

  onChampionSelected(champ: string){
    const champion = this.teamChampions.find(c => c.name === champ);
    if(champion){
      this.selectedChampion.set(champion);
    } else {
      this.selectedChampion.set(null);
    }
  }

  isReadyToValidate = computed(() => {
    return this.selectedChampion() !== null && this.selectedChampion() !== NULL_CHAMPION;
  });

  toggleValidation(){
    this.validatedChoice.update(current => !current);
  }

  protected readonly NULL_CHAMPION = NULL_CHAMPION;
}
