import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChampionPromptComponent } from './champion-prompt.component';

describe('ChampionPromptComponent', () => {
  let component: ChampionPromptComponent;
  let fixture: ComponentFixture<ChampionPromptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChampionPromptComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChampionPromptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
