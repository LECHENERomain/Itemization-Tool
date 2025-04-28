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
  championInputControl = new FormControl('');

  constructor(private championsService: ChampionsService){
    this.champions = championsService.champions;
  }

}
