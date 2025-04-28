import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChampionIconComponent } from './champion-icon.component';

describe('ChampionIconComponent', () => {
  let component: ChampionIconComponent;
  let fixture: ComponentFixture<ChampionIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChampionIconComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChampionIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
