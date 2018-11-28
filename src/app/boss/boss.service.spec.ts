import { BossService } from './boss.service';
import { ItemService } from '../items/item.service';
import { SettingsService } from '../settings/settings.service';
import { LocalStorageService } from '../local-storage.service';

import { WordSpacingPipe } from '../word-spacing.pipe';

import { ItemKey } from '../items/item-key';

import { SwordLogic } from '../settings/sword-logic';

import { DungeonKey } from '../dungeon/dungeon-key';

describe( 'The boss service', () => {
  let bossService: BossService;
  let itemService: ItemService;
  let settingsService: SettingsService;

  function reset() {
    itemService.reset();
  }

  function validate(location: DungeonKey, value: any) {
    expect( bossService.canDefeatBoss(location)).toBe(value);
  }

  describe( 'when not in swordless mode', () => {
    beforeAll(() => {
      settingsService = new SettingsService( new LocalStorageService(), new WordSpacingPipe() );
      spyOnProperty( settingsService, 'swordLogic', 'get').and.returnValue( SwordLogic.Randomized );

      itemService = new ItemService(settingsService);
      bossService = new BossService(settingsService, itemService);
    });

    beforeEach( reset );

    it( 'cannot defeat the Armos Knights at the start.', () => {
      validate(DungeonKey.EasternPalace, false);
    });

    it( 'cannot defeat the Lanmolas at the start.', () => {
      validate(DungeonKey.DesertPalace, false);
    });

    it( 'cannot defeat Moldorm at the start.', () => {
      validate(DungeonKey.TowerOfHera, false);
    });

    it( 'cannot defeat Agahnim at the start.', () => {
      validate(DungeonKey.CastleTower, false);
    });

    it( 'can defeat Agahnim with the bug net.', () => {
      itemService.setItemState(ItemKey.Net, 1);

      validate(DungeonKey.CastleTower, true);
    });

    it( 'cannot defeat the Helmasaur King at the start.', () => {
      validate(DungeonKey.PalaceOfDarkness, false);
    });

    it( 'can defeat the Helmasaur King with bombs and bow.', () => {
      itemService.setItemState(ItemKey.Bomb, 1);
      itemService.setItemState(ItemKey.Bow, 1);

      validate(DungeonKey.PalaceOfDarkness, true);
    });

    it( 'can defeat the Helmasaur King with just the hammer.', () => {
      itemService.setItemState(ItemKey.Hammer, 1);

      validate(DungeonKey.PalaceOfDarkness, true);
    });

    it( 'cannot defeat Arrghus at the start.', () => {
      validate(DungeonKey.SwampPalace, false);
    });

    it( 'can defeat Arrghus with the hookshot and bombs. LOTS of bombs.', () => {
      itemService.setItemState(ItemKey.Hookshot, 1);
      itemService.setItemState(ItemKey.Bomb, 1);

      validate(DungeonKey.SwampPalace, true);
    });

    it( 'cannot defeat Mothula at the start.', () => {
      validate(DungeonKey.SkullWoods, false);
    });

    it( 'cannot defeat Blind at the start.', () => {
      validate(DungeonKey.ThievesTown, false);
    });

    it( 'cannot defeat Kholdstare at the start.', () => {
      validate(DungeonKey.IcePalace, false);
    });

    it( 'can defeat Kholdstare with bombos and sword.', () => {
      itemService.setItemState(ItemKey.Bombos, 1);
      itemService.setItemState(ItemKey.Sword, 2);

      validate(DungeonKey.IcePalace, true);
    });

    it( 'cannot defeat Vittreous at the start.', () => {
      validate(DungeonKey.MiseryMire, false);
    });

    it( 'cannot defeat Trinexx at the start.', () => {
      validate(DungeonKey.TurtleRock, false);
    });

    it( 'cannot defeat Trinexx even with the fire rod and hammer.', () => {
      itemService.setItemState(ItemKey.FireRod, 1);
      itemService.setItemState(ItemKey.Hammer, 1);

      validate(DungeonKey.TurtleRock, false);
    });

    it( 'can defeat Trinexx with both rods and hammer.', () => {
      itemService.setItemState(ItemKey.FireRod, 1);
      itemService.setItemState(ItemKey.IceRod, 1);
      itemService.setItemState(ItemKey.Hammer, 1);

      validate(DungeonKey.TurtleRock, true);
    });
  });

  describe( 'when in swordless mode', () => {
    beforeAll(() => {
      settingsService = new SettingsService( new LocalStorageService(), new WordSpacingPipe() );
      spyOnProperty( settingsService, 'swordLogic', 'get').and.returnValue( SwordLogic.Swordless );

      itemService = new ItemService(settingsService);
      bossService = new BossService(settingsService, itemService);
    });

    beforeEach( reset );

    it( 'can defeat Kholdstare with fire rod and hammer.', () => {
      itemService.setItemState(ItemKey.FireRod, 1);
      itemService.setItemState(ItemKey.Hammer, 1);

      validate(DungeonKey.IcePalace, true);
    });
  });

  afterAll( reset );
});
