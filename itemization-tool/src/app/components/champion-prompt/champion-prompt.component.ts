import { Component, signal } from '@angular/core';
import {ChampionsService} from '../../champions.service';
import {Champion} from '../../champion';


@Component({
  selector: 'app-champion-prompt',
  imports: [],
  templateUrl: './champion-prompt.component.html',
  styleUrl: './champion-prompt.component.scss'
})
export class ChampionPromptComponent {

  constructor(private championsService: ChampionsService) {
  }

  get blueTeam(){
    return this.championsService.blueTeam();
  }

  get redTeam(){
    return this.championsService.redTeam();
  }
}
