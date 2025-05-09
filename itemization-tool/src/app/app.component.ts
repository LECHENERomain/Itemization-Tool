import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {TeamSelectorComponent} from './components/team-selector/team-selector.component';
import {ChampionPromptComponent} from './components/champion-prompt/champion-prompt.component';
import {ItemShopComponent} from './components/item-shop/item-shop.component';
import {MinimapComponent} from './components/minimap/minimap.component';

@Component({
  selector: 'app-root',
  imports: [TeamSelectorComponent, ChampionPromptComponent, ItemShopComponent, MinimapComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'itemization-tool';
}
