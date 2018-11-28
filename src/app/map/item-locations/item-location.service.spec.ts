import { ItemLocationService } from './item-location.service';
import { ItemService } from '../../items/item.service';
import { DungeonService } from '../../dungeon/dungeon.service';
import { SettingsService } from '../../settings/settings.service';
import { LocalStorageService } from '../../local-storage.service';

import { ItemLocation } from './item-location';
import { Availability } from '../availability';
import { LocationKey } from './location-key';
import { ItemKey } from '../../items/item-key';

import { WordSpacingPipe } from '../../word-spacing.pipe';

import { DungeonKey } from '../../dungeon/dungeon-key';
import { StartState } from '../../settings/start-state';

describe( 'The item location service', () => {
  let itemLocationService: ItemLocationService;
  let itemService: ItemService;
  let dungeonService: DungeonService;
  let settingsService: SettingsService;

  beforeAll(() => {
    settingsService = new SettingsService( new LocalStorageService(), new WordSpacingPipe() );
  });

  beforeEach( () => {
    itemService = new ItemService( settingsService );
    itemService.reset();
    dungeonService = new DungeonService();
    dungeonService.reset();
    itemLocationService = new ItemLocationService( itemService, dungeonService, settingsService );
    itemLocationService.reset();
  });

  describe( 'set to the King\'s Tomb', () => {
    it( 'starts off as unavailable.', () => {
      expect( itemLocationService.getAvailability(DungeonKey.KingsTomb) ).toBe( Availability.Unavailable );
    });

    it( 'can be made available with the boots and titan\'s mitts.', () => {
      itemService.setItemState(ItemKey.Boots, 1);
      itemService.setItemState(ItemKey.Glove, 2);

      expect( itemLocationService.getAvailability(DungeonKey.KingsTomb) ).toBe( Availability.Available );
    });

    it( 'cannot be made available with just the power gloves.', () => {
      itemService.setItemState(ItemKey.MoonPearl, 1);
      itemService.setItemState(ItemKey.Glove, 1);

      expect( itemLocationService.getAvailability(DungeonKey.KingsTomb) ).toBe( Availability.Unavailable );
    });

    it( 'cannot be done even with the mitts, pearl, and mirror.', () => {
      itemService.setItemState(ItemKey.MoonPearl, 1);
      itemService.setItemState(ItemKey.Glove, 1);
      itemService.setItemState(ItemKey.Hammer, 1);
      itemService.setItemState(ItemKey.Mirror, 1);

      expect( itemLocationService.getAvailability(DungeonKey.KingsTomb) ).toBe( Availability.Unavailable );
    });

    it( 'cannot be gotten with just the boots, though.', () => {
      itemService.setItemState(ItemKey.Boots, 1);

      expect( itemLocationService.getAvailability(DungeonKey.KingsTomb) ).toBe( Availability.Unavailable );
    });

    it( 'can cleanly be made available with gloves, hammer, mirror, and boots.', () => {
      itemService.setItemState(ItemKey.MoonPearl, 1);
      itemService.setItemState(ItemKey.Glove, 1);
      itemService.setItemState(ItemKey.Hammer, 1);
      itemService.setItemState(ItemKey.Mirror, 1);
      itemService.setItemState(ItemKey.Boots, 1);

      expect( itemLocationService.getAvailability(DungeonKey.KingsTomb) ).toBe( Availability.Available );
    });

    it( 'cannot be available if you only defeated Agahnim and have the hookshot.', () => {
      dungeonService.getDungeon(DungeonKey.CastleTower).toggleDefeat();
      itemService.setItemState(ItemKey.MoonPearl, 1);
      itemService.setItemState(ItemKey.Hookshot, 1);

      expect( itemLocationService.getAvailability(DungeonKey.KingsTomb) ).toBe( Availability.Unavailable );
    });

    it( 'can be available if you defeated Agahnim and have the hookshot, some flippers, and boots.', () => {
      dungeonService.getDungeon(DungeonKey.CastleTower).toggleDefeat();
      itemService.setItemState(ItemKey.Hookshot, 1);
      itemService.setItemState(ItemKey.MoonPearl, 1);
      itemService.setItemState(ItemKey.Flippers, 1);
      itemService.setItemState(ItemKey.Mirror, 1);
      itemService.setItemState(ItemKey.Boots, 1);

      expect( itemLocationService.getAvailability(DungeonKey.KingsTomb) ).toBe( Availability.Available );
    });

    it( 'can be available if you defeated Agahnim and have the hookshot, flippers, and boots.', () => {
      dungeonService.getDungeon(DungeonKey.CastleTower).toggleDefeat();
      itemService.setItemState(ItemKey.Hookshot, 1);
      itemService.setItemState(ItemKey.MoonPearl, 1);
      itemService.setItemState(ItemKey.Flippers, 1);
      itemService.setItemState(ItemKey.Mirror, 1);
      itemService.setItemState(ItemKey.Boots, 1);

      expect( itemLocationService.getAvailability(DungeonKey.KingsTomb) ).toBe( Availability.Available );
    });
  });

  describe( 'set to the Light World Swamp', () => {
    it( 'starts off as available no matter what.', () => {
      expect( itemLocationService.getAvailability(DungeonKey.LightWorldSwamp) ).toBe( Availability.Available );
    });
  });

  describe( 'set to Link\'s house', () => {
    const location = DungeonKey.LinksHouse;
    const tempSettings = new SettingsService(new LocalStorageService(), new WordSpacingPipe() );
    let tempService: ItemLocationService;

    describe( 'in the open start state', () => {
      beforeEach( () => {
        spyOnProperty( tempSettings, 'startState', 'get').and.returnValue(StartState.Open);
        tempService = new ItemLocationService( itemService, dungeonService, tempSettings );
      });

      it( 'starts off as available.', () => {
        expect( tempService.getAvailability( DungeonKey.LinksHouse) ).toBe( Availability.Available );
        expect( tempService.getItemLocation(location).isOpened ).toBeFalsy();
      });
    });

    describe( 'in the standard start state', () => {
      beforeEach( () => {
        spyOnProperty( tempSettings, 'startState', 'get').and.returnValue(StartState.Standard);
        tempService = new ItemLocationService( itemService, dungeonService, tempSettings );
      });

      xit( 'starts off as claimed.', () => {
        expect( tempService.getAvailability( DungeonKey.LinksHouse) ).toBe( Availability.Available );
        expect( tempService.getItemLocation(location).isOpened ).toBeTruthy();
      });
    });
  });

  describe( 'set to the Spiral Cave', () => {
    it( 'starts off as unavailable.', () => {
      expect( itemLocationService.getAvailability( DungeonKey.SpiralCave)).toBe( Availability.Unavailable);
    });

    it( 'needs more than a glove to get in.', () => {
      itemService.setItemState(ItemKey.Glove, 1);

      expect( itemLocationService.getAvailability( DungeonKey.SpiralCave)).toBe( Availability.Unavailable);
    });

    it( 'can be gotten with glove and hookshot assuming sequence breaks are used.', () => {
      itemService.setItemState(ItemKey.Glove, 1);
      itemService.setItemState(ItemKey.Hookshot, 1);

      expect( itemLocationService.getAvailability( DungeonKey.SpiralCave)).toBe( Availability.Glitches);
    });

    it( 'can be gotten cleanly with the flute, mirror, and hammer.', () => {
      itemService.setItemState(ItemKey.Flute, 1);
      itemService.setItemState(ItemKey.Mirror, 1);
      itemService.setItemState(ItemKey.Hammer, 1);

      expect( itemLocationService.getAvailability( DungeonKey.SpiralCave)).toBe( Availability.Available);
    });
  });

  describe( 'set to Kakariko Well', () => {
    it( 'can potentially be fully raided if lucky with the first few chests.', () => {
      expect( itemLocationService.getAvailability( DungeonKey.KakarikoWell ) ).toBe( Availability.Possible );
    });

    it( 'is fully clearable if bombs are on hand.', () => {
      itemService.setItemState( ItemKey.Bomb, 1 );
      expect( itemLocationService.getAvailability( DungeonKey.KakarikoWell ) ).toBe( Availability.Available );
    });
  });

  describe( 'set to Paradox Cave', () => {
    const location = DungeonKey.ParadoxCave;

    it( 'requires access to East Death Mountain on the light world.', () => {
      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Unavailable );
    });

    it( 'is possible to get all of the chests, though two are missing without bombs.', () => {
      itemService.setItemState(ItemKey.Flute, 1);
      itemService.setItemState(ItemKey.Hookshot, 1);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Possible );
    } );

    it( 'can be raided fully with bombs.', () => {
      itemService.setItemState(ItemKey.Flute, 1);
      itemService.setItemState(ItemKey.Hookshot, 1);
      itemService.setItemState(ItemKey.Bomb, 1);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Available );
    } );

    it( 'is possible to illogically get all of the chests, though two are missing without bombs.', () => {
      itemService.setItemState(ItemKey.Glove, 1);
      itemService.setItemState(ItemKey.Mirror, 1);
      itemService.setItemState(ItemKey.Hammer, 1);
      itemService.setItemState(ItemKey.Hookshot, 1);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Glitches );
    } );

    it( 'can be illogically raided fully with bombs.', () => {
      itemService.setItemState(ItemKey.Glove, 1);
      itemService.setItemState(ItemKey.Mirror, 1);
      itemService.setItemState(ItemKey.Hammer, 1);
      itemService.setItemState(ItemKey.Hookshot, 1);
      itemService.setItemState(ItemKey.Bomb, 1);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Glitches );
    } );
  });

  describe( 'set to the Mimic Cave', () => {
    it( 'starts off as unavailable.', () => {
      expect( itemLocationService.getAvailability( DungeonKey.MimicCave) ).toBe( Availability.Unavailable );
    });

    it( 'requires more than the moon pearl for a chance to get in.', () => {
      itemService.setItemState(ItemKey.MoonPearl, 1);

      expect( itemLocationService.getAvailability( DungeonKey.MimicCave)  ).toBe( Availability.Unavailable );
    });

    it( 'requires more than the hammer too.', () => {
      itemService.setItemState(ItemKey.MoonPearl, 1);
      itemService.setItemState(ItemKey.Hammer, 1);

      expect( itemLocationService.getAvailability( DungeonKey.MimicCave)  ).toBe( Availability.Unavailable );
    });

    it( 'requires more than the cane of somaria too.', () => {
      itemService.setItemState(ItemKey.MoonPearl, 1);
      itemService.setItemState(ItemKey.Hammer, 1);
      itemService.setItemState(ItemKey.Somaria, 1);

      expect( itemLocationService.getAvailability( DungeonKey.MimicCave)  ).toBe( Availability.Unavailable );
    });

    it( 'requires more than the magic mirror too.', () => {
      itemService.setItemState(ItemKey.MoonPearl, 1);
      itemService.setItemState(ItemKey.Hammer, 1);
      itemService.setItemState(ItemKey.Somaria, 1);
      itemService.setItemState(ItemKey.Mirror, 1);

      expect( itemLocationService.getAvailability( DungeonKey.MimicCave)  ).toBe( Availability.Unavailable );
    });

    it( 'requires more than the power glove. The titan\'s mitts are required.', () => {
      itemService.setItemState(ItemKey.MoonPearl, 1);
      itemService.setItemState(ItemKey.Hammer, 1);
      itemService.setItemState(ItemKey.Somaria, 1);
      itemService.setItemState(ItemKey.Mirror, 1);
      itemService.setItemState(ItemKey.Glove, 1);

      expect( itemLocationService.getAvailability( DungeonKey.MimicCave)  ).toBe( Availability.Unavailable );
    });

    it( 'requires at least one medallion to have a chance.', () => {
      itemService.setItemState(ItemKey.MoonPearl, 1);
      itemService.setItemState(ItemKey.Hammer, 1);
      itemService.setItemState(ItemKey.Somaria, 1);
      itemService.setItemState(ItemKey.Mirror, 1);
      itemService.setItemState(ItemKey.Glove, 2);

      expect( itemLocationService.getAvailability( DungeonKey.MimicCave)  ).toBe( Availability.Unavailable );
    });

    it( 'requires a sword to utilize a medallion to get here (assuming no swordless mode).', () => {
      itemService.setItemState(ItemKey.MoonPearl, 1);
      itemService.setItemState(ItemKey.Hammer, 1);
      itemService.setItemState(ItemKey.Somaria, 1);
      itemService.setItemState(ItemKey.Mirror, 1);
      itemService.setItemState(ItemKey.Glove, 2);
      itemService.setItemState(ItemKey.Bombos, 1);

      expect( itemLocationService.getAvailability( DungeonKey.MimicCave)  ).toBe( Availability.Unavailable );
    });

    it( 'can potentially be available with bombos in hand if no dungeon medallion info is available.', () => {
      itemService.setItemState(ItemKey.MoonPearl, 1);
      itemService.setItemState(ItemKey.Hammer, 1);
      itemService.setItemState(ItemKey.Somaria, 1);
      itemService.setItemState(ItemKey.Mirror, 1);
      itemService.setItemState(ItemKey.Glove, 2);
      itemService.setItemState(ItemKey.Bombos, 1);
      itemService.setItemState(ItemKey.Sword, 1);

      expect( itemLocationService.getAvailability( DungeonKey.MimicCave)  ).toBe( Availability.Possible );
    });

    it( 'can potentially be available with ether in hand if no dungeon medallion info is available.', () => {
      itemService.setItemState(ItemKey.MoonPearl, 1);
      itemService.setItemState(ItemKey.Hammer, 1);
      itemService.setItemState(ItemKey.Somaria, 1);
      itemService.setItemState(ItemKey.Mirror, 1);
      itemService.setItemState(ItemKey.Glove, 2);
      itemService.setItemState(ItemKey.Ether, 1);
      itemService.setItemState(ItemKey.Sword, 1);

      expect( itemLocationService.getAvailability( DungeonKey.MimicCave)  ).toBe( Availability.Possible );
    });

    it( 'can potentially be available with bombos and ether in hand if no dungeon medallion info is available.', () => {
      itemService.setItemState(ItemKey.MoonPearl, 1);
      itemService.setItemState(ItemKey.Hammer, 1);
      itemService.setItemState(ItemKey.Somaria, 1);
      itemService.setItemState(ItemKey.Mirror, 1);
      itemService.setItemState(ItemKey.Glove, 2);
      itemService.setItemState(ItemKey.Bombos, 1);
      itemService.setItemState(ItemKey.Ether, 1);
      itemService.setItemState(ItemKey.Sword, 1);

      expect( itemLocationService.getAvailability( DungeonKey.MimicCave)  ).toBe( Availability.Possible );
    });

    it( 'is not possible if bombos is available but Turtle Rock needs ether.', () => {
      itemService.setItemState(ItemKey.MoonPearl, 1);
      itemService.setItemState(ItemKey.Hammer, 1);
      itemService.setItemState(ItemKey.Somaria, 1);
      itemService.setItemState(ItemKey.Mirror, 1);
      itemService.setItemState(ItemKey.Glove, 2);
      itemService.setItemState(ItemKey.Bombos, 1);
      itemService.setItemState(ItemKey.Sword, 1);
      dungeonService.getDungeon(DungeonKey.TurtleRock).cycleEntranceLock();
      dungeonService.getDungeon(DungeonKey.TurtleRock).cycleEntranceLock();

      expect( itemLocationService.getAvailability( DungeonKey.MimicCave)  ).toBe( Availability.Unavailable );
    });

    it( 'is not possible if ether is available but Turtle Rock needs bombos.', () => {
      itemService.setItemState(ItemKey.MoonPearl, 1);
      itemService.setItemState(ItemKey.Hammer, 1);
      itemService.setItemState(ItemKey.Somaria, 1);
      itemService.setItemState(ItemKey.Mirror, 1);
      itemService.setItemState(ItemKey.Glove, 2);
      itemService.setItemState(ItemKey.Ether, 1);
      itemService.setItemState(ItemKey.Sword, 1);
      dungeonService.getDungeon(DungeonKey.TurtleRock).cycleEntranceLock();

      expect( itemLocationService.getAvailability( DungeonKey.MimicCave)  ).toBe( Availability.Unavailable );
    });

    it( 'is not possible if bombos is available but Turtle Rock needs quake.', () => {
      itemService.setItemState(ItemKey.MoonPearl, 1);
      itemService.setItemState(ItemKey.Hammer, 1);
      itemService.setItemState(ItemKey.Somaria, 1);
      itemService.setItemState(ItemKey.Mirror, 1);
      itemService.setItemState(ItemKey.Glove, 2);
      itemService.setItemState(ItemKey.Bombos, 1);
      itemService.setItemState(ItemKey.Sword, 1);
      dungeonService.getDungeon(DungeonKey.TurtleRock).cycleEntranceLock();
      dungeonService.getDungeon(DungeonKey.TurtleRock).cycleEntranceLock();
      dungeonService.getDungeon(DungeonKey.TurtleRock).cycleEntranceLock();

      expect( itemLocationService.getAvailability( DungeonKey.MimicCave)  ).toBe( Availability.Unavailable );
    });

    it( 'is possible if bombos is available and Turtle Rock needs bombos, but no fire rod is there.', () => {
      itemService.setItemState(ItemKey.MoonPearl, 1);
      itemService.setItemState(ItemKey.Hammer, 1);
      itemService.setItemState(ItemKey.Somaria, 1);
      itemService.setItemState(ItemKey.Mirror, 1);
      itemService.setItemState(ItemKey.Glove, 2);
      itemService.setItemState(ItemKey.Bombos, 1);
      itemService.setItemState(ItemKey.Sword, 1);
      dungeonService.getDungeon(DungeonKey.TurtleRock).cycleEntranceLock();

      expect( itemLocationService.getAvailability( DungeonKey.MimicCave)  ).toBe( Availability.Possible );
    });

    it( 'can be sequence broken into if everything except lantern and flute are available.', () => {
      itemService.setItemState(ItemKey.MoonPearl, 1);
      itemService.setItemState(ItemKey.Hammer, 1);
      itemService.setItemState(ItemKey.Somaria, 1);
      itemService.setItemState(ItemKey.Mirror, 1);
      itemService.setItemState(ItemKey.Glove, 2);
      itemService.setItemState(ItemKey.Bombos, 1);
      itemService.setItemState(ItemKey.Sword, 1);
      itemService.setItemState(ItemKey.FireRod, 1);
      dungeonService.getDungeon(DungeonKey.TurtleRock).cycleEntranceLock();

      expect( itemLocationService.getAvailability( DungeonKey.MimicCave)  ).toBe( Availability.Glitches );
    });

    it( 'can be accessed normally into if everything plus the lantern are available.', () => {
      itemService.setItemState(ItemKey.MoonPearl, 1);
      itemService.setItemState(ItemKey.Hammer, 1);
      itemService.setItemState(ItemKey.Somaria, 1);
      itemService.setItemState(ItemKey.Mirror, 1);
      itemService.setItemState(ItemKey.Glove, 2);
      itemService.setItemState(ItemKey.Bombos, 1);
      itemService.setItemState(ItemKey.Sword, 1);
      itemService.setItemState(ItemKey.FireRod, 1);
      itemService.setItemState(ItemKey.Lantern, 1);
      dungeonService.getDungeon(DungeonKey.TurtleRock).cycleEntranceLock();

      expect( itemLocationService.getAvailability( DungeonKey.MimicCave) ).toBe( Availability.Available );
    });

    it( 'can be accessed normally into if everything plus the flute are available.', () => {
      itemService.setItemState(ItemKey.MoonPearl, 1);
      itemService.setItemState(ItemKey.Hammer, 1);
      itemService.setItemState(ItemKey.Somaria, 1);
      itemService.setItemState(ItemKey.Mirror, 1);
      itemService.setItemState(ItemKey.Glove, 2);
      itemService.setItemState(ItemKey.Bombos, 1);
      itemService.setItemState(ItemKey.Sword, 1);
      itemService.setItemState(ItemKey.FireRod, 1);
      itemService.setItemState(ItemKey.Flute, 1);
      dungeonService.getDungeon(DungeonKey.TurtleRock).cycleEntranceLock();

      expect( itemLocationService.getAvailability( DungeonKey.MimicCave)  ).toBe( Availability.Available );
    });
  });

  describe( 'set to the bonk rocks west of Sanctuary', () => {
    it( 'starts off as unavailable.', () => {
      expect( itemLocationService.getAvailability( DungeonKey.BonkRocks ) ).toBe( Availability.Unavailable );
    });

    it( 'becomes available when the boots are acquired.', () => {
      itemService.setItemState(ItemKey.Boots, 1);
      expect( itemLocationService.getAvailability( DungeonKey.BonkRocks ) ).toBe( Availability.Available );
    });
  });

  describe( 'set to Sahasrahla himself', () => {
    it( 'starts off as unavailable.', () => {
      expect( itemLocationService.getAvailability( DungeonKey.SahasrahlasReward ) ).toBe( Availability.Unavailable );
    });

    it( 'becomes available when the one boss with the green pendant is defeated.', () => {
      // TODO: Random number this.
      const dungeonId = 3;
      const dungeon = dungeonService.getDungeon( dungeonId );
      dungeon.toggleDefeat();
      dungeon.cycleReward();

      expect( itemLocationService.getAvailability( DungeonKey.SahasrahlasReward ) ).toBe( Availability.Available );
    });
  });

  describe( 'set to the sick kid\'s house', () => {
    it( 'starts off as unavailable.', () => {
      expect( itemLocationService.getAvailability( DungeonKey.SickKid ) ).toBe( Availability.Unavailable );
    });

    it( 'becomes available when one bottle is acquired.', () => {
      itemService.setItemState(ItemKey.Bottle, 1);
      expect( itemLocationService.getAvailability( DungeonKey.SickKid ) ).toBe( Availability.Available );
    });
  });

  describe( 'set to the person under the bridge', () => {
    it( 'starts off as available...with fake flippers glitching.', () => {
      expect( itemLocationService.getAvailability( DungeonKey.BridgeHideout ) ).toBe( Availability.Glitches );
    });

    it( 'becomes properly available when the flippers are on hand.', () => {
      itemService.setItemState(ItemKey.Flippers, 1);

      expect( itemLocationService.getAvailability( DungeonKey.BridgeHideout ) ).toBe( Availability.Available );
    });
  });

  describe( 'set to the waterfall of wishing', () => {
    const location = DungeonKey.WaterfallOfWishing;
    it( 'starts off as unavailable.', () => {
      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Unavailable );
    });

    it( 'could be available with sequence breaks using the moon pearl & fake flippering.', () => {
      itemService.setItemState(ItemKey.MoonPearl, 1);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Glitches );
    });

    it( 'is properly available with the real flippers.', () => {
      itemService.setItemState(ItemKey.Flippers, 1);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Available );
    });
  });

  describe( 'set to the ether tablet', () => {
    const location = DungeonKey.EtherTablet;
    it( 'starts off as unavailable.', () => {
      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Unavailable );
    });

    it( 'requires more than the book.', () => {
      itemService.setItemState(ItemKey.Book, 1);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Unavailable );
    });

    it( 'requires more than a glove.', () => {
      itemService.setItemState(ItemKey.Book, 1);
      itemService.setItemState(ItemKey.Glove, 1);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Unavailable );
    });

    it( 'can reveal the item to you if you have a mirror, assuming you sequence broke.', () => {
      itemService.setItemState(ItemKey.Book, 1);
      itemService.setItemState(ItemKey.Glove, 1);
      itemService.setItemState(ItemKey.Mirror, 1);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.GlitchesVisible );
    });

    it( 'can reveal the item to you if you have the hookshot and hammer.', () => {
      itemService.setItemState(ItemKey.Book, 1);
      itemService.setItemState(ItemKey.Glove, 1);
      itemService.setItemState(ItemKey.Lantern, 1);
      itemService.setItemState(ItemKey.Hookshot, 1);
      itemService.setItemState(ItemKey.Hammer, 1);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Visible );
    });

    it( 'can be gotten with the correct sword, though sequence breaks are needed with the glove and no lantern.', () => {
      itemService.setItemState(ItemKey.Book, 1);
      itemService.setItemState(ItemKey.Glove, 1);
      itemService.setItemState(ItemKey.Mirror, 1);
      itemService.getItem(ItemKey.Sword).state = 2;

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Glitches );
    });

    it( 'can be gotten properly with the correct sword and a flute.', () => {
      itemService.setItemState(ItemKey.Book, 1);
      itemService.setItemState(ItemKey.Glove, 1);
      itemService.setItemState(ItemKey.Mirror, 1);
      itemService.getItem(ItemKey.Sword).state = 2;
      itemService.setItemState(ItemKey.Flute, 1);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Available );
    });
  });

  describe( 'set to the bombos tablet', () => {
    const location = DungeonKey.BombosTablet;

    it( 'starts off as unavailable.', () => {
      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Unavailable );
    });

    it( 'needs all Mirror Cave requirements to be accessible.', () => {
      itemService.setItemState(ItemKey.Book, 1);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Unavailable );
    });

    it( 'can state what is in the tablet without the weapon.', () => {
      itemService.setItemState(ItemKey.Book, 1);
      itemService.setItemState(ItemKey.Glove, 1);
      itemService.setItemState(ItemKey.Hammer, 1);
      itemService.setItemState(ItemKey.MoonPearl, 1);
      itemService.setItemState(ItemKey.Mirror, 1);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Visible );
    });

    it( 'is available with tablet access and a proper weapon.', () => {
      itemService.setItemState(ItemKey.Book, 1);
      itemService.setItemState(ItemKey.Glove, 1);
      itemService.setItemState(ItemKey.Hammer, 1);
      itemService.setItemState(ItemKey.MoonPearl, 1);
      itemService.setItemState(ItemKey.Mirror, 1);
      itemService.getItem(ItemKey.Sword).state = 2;

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Available );
    });
  });

  describe( 'set to the floating island', () => {
    const location = DungeonKey.FloatingIsland;

    it( 'starts off as unavailable.', () => {
      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Unavailable );
    });

    it( 'needs more than a glove to at least see it.', () => {
      itemService.setItemState(ItemKey.Glove, 1);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Unavailable );
    });

    it( 'needs more than a glove & hammer to at least see it.', () => {
      itemService.setItemState(ItemKey.Glove, 1);
      itemService.setItemState(ItemKey.Hammer, 1);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Unavailable );
    });

    it( 'can be visible with the glove, hammer, and mirror...assuming you sequence broke', () => {
      itemService.setItemState(ItemKey.Glove, 1);
      itemService.setItemState(ItemKey.Hammer, 1);
      itemService.setItemState(ItemKey.Mirror, 1);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.GlitchesVisible );
    });

    it( 'can be retrieved with the titan\'s mitts and moon pearl, with dark room navigation.', () => {
      itemService.setItemState(ItemKey.Glove, 2);
      itemService.setItemState(ItemKey.Hammer, 1);
      itemService.setItemState(ItemKey.Mirror, 1);
      itemService.setItemState(ItemKey.MoonPearl, 1);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Glitches );
    });

    it( 'can be retrieved properly with the titan\'s mitts, lantern and moon pearl.', () => {
      itemService.setItemState(ItemKey.Glove, 2);
      itemService.setItemState(ItemKey.Hammer, 1);
      itemService.setItemState(ItemKey.Mirror, 1);
      itemService.setItemState(ItemKey.MoonPearl, 1);
      itemService.setItemState(ItemKey.Lantern, 1);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Available );
    });
  });

  describe( 'set to King Zora himself', () => {
    const location = DungeonKey.KingZora;

    it( 'is available through sequence breaks at the start.', () => {
      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Glitches );
    });

    it( 'is properly available with a glove.', () => {
      itemService.setItemState(ItemKey.Glove, 1);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Available );
    });
  });

  describe( 'set to the old man to be rescued', () => {
    const location = DungeonKey.LostOldMan;

    it( 'starts off as unavailable.', () => {
      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Unavailable );
    });

    it( 'can be gotten with the flute, though as a sequence break without the lantern.', () => {
      itemService.setItemState(ItemKey.Flute, 1);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Glitches );
    });

    it( 'can properly be gotten with a glove and a lantern.', () => {
      itemService.setItemState(ItemKey.Glove, 1);
      itemService.setItemState(ItemKey.Lantern, 1);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Available );
    });
  });

  describe( 'set to the potion shop', () => {
    const location = DungeonKey.PotionShop;

    it( 'starts off as unavailable.', () => {
      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Unavailable );
    });

    it( 'can be available if the mushroom is given.', () => {
      itemService.setItemState(ItemKey.Mushroom, 1);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Available );
    });
  });

  describe( 'set to the lumberjack cave', () => {
    const location = DungeonKey.LumberjackTree;

    it( 'starts off as unavailable.', () => {
      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Visible );
    });

    it( 'needs more than Agahnim to be defeated.', () => {
      dungeonService.getDungeon(DungeonKey.CastleTower).toggleDefeat();

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Visible );
    });

    it( 'also needs the boots.', () => {
      dungeonService.getDungeon(DungeonKey.CastleTower).toggleDefeat();
      itemService.setItemState(ItemKey.Boots, 1);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Available );
    });
  });

  describe( 'set to the mad batter\'s home', () => {
    const location = DungeonKey.MadBatter;

    it( 'starts off as unavailable.', () => {
      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Unavailable );
    });

    it( 'needs more than the hammer to access.', () => {
      itemService.setItemState(ItemKey.Hammer, 1);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Unavailable );
    });

    it( 'needs is accessible (through glitches) with the mushroom.', () => {
      itemService.setItemState(ItemKey.Hammer, 1);
      itemService.setItemState(ItemKey.Mushroom, 1);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Glitches );
    });

    it( 'needs is accessible legitmately with the powder.', () => {
      itemService.setItemState(ItemKey.Glove, 2);
      itemService.setItemState(ItemKey.Mirror, 1);
      itemService.setItemState(ItemKey.MoonPearl, 1);
      itemService.setItemState(ItemKey.Powder, 1);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Available );
    });
  });

  describe( 'set to the spectacle rock cave', () => {
    const location = DungeonKey.SpectacleRockCave;

    it( 'starts off as unavailable.', () => {
      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Unavailable );
    });

    it( 'can be gotten with the flute by itself.', () => {
      itemService.setItemState(ItemKey.Flute, 1);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Available );
    });

    it( 'can be gotten with a glove, but requires dark room navigation without the lantern.', () => {
      itemService.setItemState(ItemKey.Glove, 1);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Glitches );
    });
  });

  describe( 'set to the dwarf turned into the frog', () => {
    const location = DungeonKey.DwarfEscort;

    it( 'starts off as unavailable.', () => {
      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Unavailable );
    });

    it( 'needs both the moon pearl and titan\'s mitts to access.', () => {
      itemService.setItemState(ItemKey.Glove, 2);
      itemService.setItemState(ItemKey.MoonPearl, 1);
      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Available );
    });
  });

  describe( 'set to the graveyard cliff', () => {
    const location = DungeonKey.GraveyardCliffCave;

    it( 'starts off as unavailable.', () => {
      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Unavailable );
    });

    it( 'can be accessed with access to the village of outcasts and a mirror.', () => {
      itemService.setItemState(ItemKey.Glove, 1);
      itemService.setItemState(ItemKey.Hammer, 1);
      itemService.setItemState(ItemKey.Mirror, 1);
      itemService.setItemState(ItemKey.MoonPearl, 1);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Available );
    });
  });

  describe( 'set to the top of spectacle rock', () => {
    const location = DungeonKey.SpectacleRock;

    it( 'starts off as unavailable.', () => {
      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Unavailable );
    });

    it( 'is visible as soon as a glove is on hand.', () => {
      itemService.setItemState(ItemKey.Glove, 1);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.GlitchesVisible );
    });

    it( 'can be gotten with a mirror, though it involves a sequence break.', () => {
      itemService.setItemState(ItemKey.Glove, 1);
      itemService.setItemState(ItemKey.Mirror, 1);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Glitches );
    });

    it( 'can be gotten properly with a flute.', () => {
      itemService.setItemState(ItemKey.Flute, 1);
      itemService.setItemState(ItemKey.Mirror, 1);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Available );
    });
  });

  describe( 'set to the checkerboard cave above the desert', () => {
    const location = DungeonKey.CheckerboardCave;

    it( 'starts off as unavailable.', () => {
      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Unavailable );
    });

    it( 'needs the mitts, flute, and mirror to get in.', () => {
      itemService.setItemState(ItemKey.Glove, 2);
      itemService.setItemState(ItemKey.Flute, 1);
      itemService.setItemState(ItemKey.Mirror, 1);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Available );
    });
  });

  describe( 'set to the library', () => {
    const location = DungeonKey.Library;

    it( 'starts off as visible.', () => {
      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Visible );
    });

    it( 'requires the boots to grab.', () => {
      itemService.setItemState(ItemKey.Boots, 1);
      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Available );
    });
  });

  describe( 'set to the west ledge of the desert', () => {
    const location = DungeonKey.DesertWestLedge;

    it( 'starts off as visible.', () => {
      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Visible );
    });

    it( 'can be gotten with the book.', () => {
      itemService.setItemState(ItemKey.Book, 1);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Available );
    });

    it( 'can be gotten with the flute, mirror, and titan\'s mitt.', () => {
      itemService.setItemState(ItemKey.Flute, 1);
      itemService.setItemState(ItemKey.Mirror, 1);
      itemService.setItemState(ItemKey.Glove, 2);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Available );
    });
  });

  describe( 'set to the small island on Lake Hylia', () => {
    const location = DungeonKey.LakeHyliaIsland;

    it( 'starts off as visible (assuming you jump down).', () => {
      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Visible );
    });

    it( 'requires the flippers to at least be visible (normally).', () => {
      itemService.setItemState(ItemKey.Flippers, 1);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Visible );
    });

    it( 'needs more than the flippers and moon pearl.', () => {
      itemService.setItemState(ItemKey.Flippers, 1);
      itemService.setItemState(ItemKey.MoonPearl, 1);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Visible );
    });

    it( 'needs more than the flippers, moon pearl, and mirror.', () => {
      itemService.setItemState(ItemKey.Flippers, 1);
      itemService.setItemState(ItemKey.MoonPearl, 1);
      itemService.setItemState(ItemKey.Mirror, 1);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Visible );
    });

    it( 'can be retrieved with the titan\'s mitts.', () => {
      itemService.setItemState(ItemKey.Flippers, 1);
      itemService.setItemState(ItemKey.MoonPearl, 1);
      itemService.setItemState(ItemKey.Mirror, 1);
      itemService.setItemState(ItemKey.Glove, 2);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Available );
    });

    it( 'can be retrieved with any glove along with the hammer.', () => {
      itemService.setItemState(ItemKey.Flippers, 1);
      itemService.setItemState(ItemKey.MoonPearl, 1);
      itemService.setItemState(ItemKey.Mirror, 1);
      itemService.setItemState(ItemKey.Glove, 1);
      itemService.setItemState(ItemKey.Hammer, 1);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Available );
    });

    it( 'can be retrieved with mitts, moon pearl, and boots...assuming water walking is used.', () => {
      itemService.setItemState(ItemKey.Glove, 2);
      itemService.setItemState(ItemKey.MoonPearl, 1);
      itemService.setItemState(ItemKey.Mirror, 1);
      itemService.setItemState(ItemKey.Boots, 1);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Glitches );
    });
  });

  describe( 'set to the zora ledge below the king', () => {
    const location = DungeonKey.ZoraLedge;

    it( 'starts off as visible, assuming you can fake flipper.', () => {
      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.GlitchesVisible );
    });

    it( 'can be grabbed with the flippers.', () => {
      itemService.setItemState(ItemKey.Flippers, 1);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Available );
    });

    it( 'can be grabbed with the boots, using one of two water walking methods.', () => {
      itemService.setItemState( ItemKey.Boots, 1);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Glitches );
    });

    it( 'is visible normally if just a glove is on hand.', () => {
      itemService.setItemState(ItemKey.Glove, 1);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Visible );
    });
  });

  describe( 'set to the buried item in the grove', () => {
    const location = DungeonKey.BuriedItem;

    it( 'starts off as unavailable.', () => {
      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Unavailable );
    });

    it( 'is available when the shovel is acquired.', () => {
      itemService.setItemState(ItemKey.Shovel, 1);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Available );
    });
  });

  describe( 'set to the three chests in the side of the escape', () => {
    const location = DungeonKey.SewerEscapeSideRoom;
    const tempSettings = new SettingsService(new LocalStorageService(), new WordSpacingPipe() );
    let tempService: ItemLocationService;

    beforeEach( () => {
      spyOnProperty(tempSettings, 'startState', 'get').and.returnValue(StartState.Open);
      tempService = new ItemLocationService( itemService, dungeonService, tempSettings );
    });

    it( 'starts off as unavailable since boots and bombs are required.', () => {
      expect( tempService.getAvailability( location ) ).toBe( Availability.Unavailable );
    });

    it( 'can be gotten with boots and power glove, skipping the lantern.', () => {
      itemService.setItemState(ItemKey.Boots, 1);
      itemService.setItemState(ItemKey.Glove, 1);
      expect( tempService.getAvailability( location ) ).toBe( Availability.Available );
    });

    it( 'is possible to get with the lantern and bombs, though it is dependant on key locations.', () => {
      itemService.setItemState(ItemKey.Lantern, 1);
      itemService.setItemState(ItemKey.Bomb, 1);

      expect( tempService.getAvailability( location ) ).toBe( Availability.Possible );
    });
  });

  describe( 'set to the lone chest in the dark of the sewer escape', () => {
    const location = DungeonKey.SewerEscapeDarkRoom;
    const tempSettings = new SettingsService(new LocalStorageService(), new WordSpacingPipe() );
    let tempService: ItemLocationService;

    beforeEach( () => {
      spyOnProperty(tempSettings, 'startState', 'get').and.returnValue(StartState.Open);
      tempService = new ItemLocationService( itemService, dungeonService, tempSettings );
    });

    it( 'starts off as available through skipping the lantern.', () => {
      expect( tempService.getAvailability( location ) ).toBe( Availability.Glitches );
    });

    it( 'is normally available when the lantern is acquired.', () => {
      itemService.setItemState(ItemKey.Lantern, 1);

      expect( tempService.getAvailability( location ) ).toBe( Availability.Available );
    });
  });

  describe( 'set to the master sword pedestal', () => {
    const location = DungeonKey.MasterSwordPedestal;

    it( 'starts off as unavailable.', () => {
      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Unavailable );
    });

    it( 'can tell you the item if you have the book.', () => {
      itemService.setItemState(ItemKey.Book, 1);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Visible );
    });

    it( 'can be available if you defeat all of the bosses.', () => {
      dungeonService.dungeons.forEach( d => d.toggleDefeat() );

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Available );
    });
  });

  describe( 'set to the misery mire hut', () => {
    const location = DungeonKey.MireHut;

    it( 'starts off as unavailable.', () => {
      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Unavailable );
    });

    it( 'requires more than the flute.', () => {
      itemService.setItemState(ItemKey.Flute, 1);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Unavailable );
    });

    it( 'requires more than the titan mitts as well.', () => {
      itemService.setItemState(ItemKey.Flute, 1);
      itemService.setItemState(ItemKey.Glove, 2);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Unavailable );
    });

    it( 'can be gotten with the moon pearl.', () => {
      itemService.setItemState(ItemKey.Flute, 1);
      itemService.setItemState(ItemKey.Glove, 2);
      itemService.setItemState(ItemKey.MoonPearl, 1);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Available );
    });

    it( 'can be gotten with the mirror if you can pull off the super bunny glitch.', () => {
      itemService.setItemState(ItemKey.Flute, 1);
      itemService.setItemState(ItemKey.Glove, 2);
      itemService.setItemState(ItemKey.Mirror, 1);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Glitches );
    });
  });

  describe( 'set to the treasure minigame at the Village of Outcasts', () => {
    const location = DungeonKey.TreasureChestMinigame;

    it( 'starts off as unavailable.', () => {
      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Unavailable );
    });

    it( 'can be gotten with outcast access.', () => {
      itemService.setItemState(ItemKey.Glove, 2);
      itemService.setItemState(ItemKey.MoonPearl, 1);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Available );
    });
  });

  describe( 'set to the super bunny cave in Dark Death Mountain', () => {
    const location = DungeonKey.SuperBunnyCave;

    it( 'starts off as unavailable.', () => {
      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Unavailable );
    });

    it( 'needs more than the power glove.', () => {
      itemService.setItemState(ItemKey.Glove, 1);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Unavailable );
    });

    it( 'needs more than the titan mitts.', () => {
      itemService.setItemState(ItemKey.Glove, 2);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Unavailable );
    });

    it( 'is potentially available with the hookshot, though super bunny status is needed.', () => {
      itemService.setItemState(ItemKey.Glove, 2);
      itemService.setItemState(ItemKey.Hookshot, 1);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Glitches );
    });

    it( 'is potentially available with the mirror and hammer, though super bunny status is needed.', () => {
      itemService.setItemState(ItemKey.Glove, 2);
      itemService.setItemState(ItemKey.Mirror, 1);
      itemService.setItemState(ItemKey.Hammer, 1);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Glitches );
    });

    it( 'is properly available with the flute and moon pearl.', () => {
      itemService.setItemState(ItemKey.Glove, 2);
      itemService.setItemState(ItemKey.Hookshot, 1);
      itemService.setItemState(ItemKey.Flute, 1);
      itemService.setItemState(ItemKey.MoonPearl, 1);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Available );
    });
  });

  describe( 'set to the byrna spike cave', () => {
    const location = DungeonKey.SpikeCave;

    it( 'starts off as unavailable.', () => {
      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Unavailable );
    });

    it( 'requires more than the glove for the end.', () => {
      itemService.setItemState(ItemKey.Glove, 1);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Unavailable );
    });

    it( 'requires more than the hammer for the beginning.', () => {
      itemService.setItemState(ItemKey.Glove, 1);
      itemService.setItemState(ItemKey.Hammer, 1);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Unavailable );
    });

    it( 'requires more than the moon pearl for the beginning.', () => {
      itemService.setItemState(ItemKey.Glove, 1);
      itemService.setItemState(ItemKey.Hammer, 1);
      itemService.setItemState(ItemKey.MoonPearl, 1);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Unavailable );
    });

    it( 'can be gotten with the cane of byrna itself, though the old man cave is still a sequence break.', () => {
      itemService.setItemState(ItemKey.Glove, 1);
      itemService.setItemState(ItemKey.Hammer, 1);
      itemService.setItemState(ItemKey.MoonPearl, 1);
      itemService.setItemState(ItemKey.Byrna, 1);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Glitches );
    });

    it( 'can be gotten with the cape itself (plus the flute).', () => {
      itemService.setItemState(ItemKey.Glove, 1);
      itemService.setItemState(ItemKey.Hammer, 1);
      itemService.setItemState(ItemKey.MoonPearl, 1);
      itemService.setItemState(ItemKey.Cape, 1);
      itemService.setItemState(ItemKey.Flute, 1);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Available );
    });

    it( 'is possible to get with one bottle of healing potion, assuming that is the contents.', () => {
      itemService.setItemState(ItemKey.Glove, 1);
      itemService.setItemState(ItemKey.Hammer, 1);
      itemService.setItemState(ItemKey.MoonPearl, 1);
      itemService.setItemState(ItemKey.Bottle, 1);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Possible );
    });
  });

  describe( 'set to the HYPE cave', () => {
    const location = DungeonKey.HypeCave;

    it( 'starts off as unavailable.', () => {
      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Unavailable );
    });

    it( 'could be gotten through the outcast route.', () => {
      itemService.setItemState(ItemKey.Glove, 2);
      itemService.setItemState(ItemKey.MoonPearl, 1);
      itemService.setItemState(ItemKey.Bomb, 1);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Available );
    });

    it( 'could be gotten through the Agahnim route.', () => {
      dungeonService.getDungeon(DungeonKey.CastleTower).toggleDefeat();
      itemService.setItemState(ItemKey.MoonPearl, 1);
      itemService.setItemState(ItemKey.Hammer, 1);
      itemService.setItemState(ItemKey.Bomb, 1);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Available );
    });
  });

  describe( 'set to the bottom chest of hookshot cave', () => {
    const location = DungeonKey.HookshotCaveBottom;

    it( 'starts off as unavailable.', () => {
      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Unavailable );
    });

    it( 'needs more than the moon pearl.', () => {
      itemService.setItemState(ItemKey.MoonPearl, 1);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Unavailable );
    });

    it( 'needs more than the titan\'s mitts.', () => {
      itemService.setItemState(ItemKey.MoonPearl, 1);
      itemService.setItemState(ItemKey.Glove, 2);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Unavailable );
    });

    it( 'can be gotten with the hookshot, assuming the DM logic is broken.', () => {
      itemService.setItemState(ItemKey.MoonPearl, 1);
      itemService.setItemState(ItemKey.Glove, 2);
      itemService.setItemState(ItemKey.Hookshot, 1);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Glitches );
    });

    it( 'can be gotten with the boots.', () => {
      itemService.setItemState(ItemKey.MoonPearl, 1);
      itemService.setItemState(ItemKey.Glove, 2);
      itemService.setItemState(ItemKey.Boots, 1);
      itemService.setItemState(ItemKey.Hammer, 1);
      itemService.setItemState(ItemKey.Mirror, 1);
      itemService.setItemState(ItemKey.Flute, 1);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Available );
    });
  });

  describe( 'set to the top three chests of hookshot cave', () => {
    const location = DungeonKey.HookshotCaveTop;

    it( 'starts off as unavailable.', () => {
      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Unavailable );
    });

    it( 'needs more than the moon pearl.', () => {
      itemService.setItemState(ItemKey.MoonPearl, 1);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Unavailable );
    });

    it( 'needs more than the titan\'s mitts.', () => {
      itemService.setItemState(ItemKey.MoonPearl, 1);
      itemService.setItemState(ItemKey.Glove, 2);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Unavailable );
    });

    it( 'is gotten with the hookshot and flute.', () => {
      itemService.setItemState(ItemKey.MoonPearl, 1);
      itemService.setItemState(ItemKey.Glove, 2);
      itemService.setItemState(ItemKey.Hookshot, 1);
      itemService.setItemState(ItemKey.Flute, 1);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Available );
    });

    it( 'can be gotten with the boots and northern path assuming you can hover.', () => {
      itemService.setItemState(ItemKey.MoonPearl, 1);
      itemService.setItemState(ItemKey.Glove, 2);
      itemService.setItemState(ItemKey.Boots, 1);
      itemService.setItemState(ItemKey.Mirror, 1);
      itemService.setItemState(ItemKey.Hammer, 1);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Glitches );
    });
  });

  describe( 'set to the purple chest', () => {
    const location = DungeonKey.PurpleChest;

    it( 'starts off as unavailable.', () => {
      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Unavailable );
    });

    it( 'requires the dwarf being returned home first.', () => {
      const dwarf = itemLocationService.getItemLocation( DungeonKey.DwarfEscort );
      dwarf.toggleOpened();

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Available );
    });
  });

  describe( 'set to the catfish', () => {
    const location = DungeonKey.Catfish;

    it( 'starts off as unavailable.', () => {
      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Unavailable );
    });

    it( 'requires more than the moon pearl.', () => {
      itemService.setItemState(ItemKey.MoonPearl, 1);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Unavailable );
    });

    it( 'requires more than the moon pearl & glove.', () => {
      itemService.setItemState(ItemKey.MoonPearl, 1);
      itemService.setItemState(ItemKey.Glove, 1);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Unavailable );
    });

    it( 'could be gotten with Agahnim\'s death.', () => {
      itemService.setItemState(ItemKey.MoonPearl, 1);
      itemService.setItemState(ItemKey.Glove, 1);
      dungeonService.getDungeon(DungeonKey.CastleTower).toggleDefeat();

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Available );
    });

    it( 'could be gotten with a hammer.', () => {
      itemService.setItemState(ItemKey.MoonPearl, 1);
      itemService.setItemState(ItemKey.Glove, 1);
      itemService.setItemState(ItemKey.Hammer, 1);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Available );
    });

    it( 'could be gotten with swimming and stronger miits.', () => {
      itemService.setItemState(ItemKey.MoonPearl, 1);
      itemService.setItemState(ItemKey.Glove, 2);
      itemService.setItemState(ItemKey.Flippers, 1);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Available );
    });

    it( 'could be gotten with mitts, moon pearl, and boots...if water walking is used.', () => {
      itemService.setItemState(ItemKey.MoonPearl, 1);
      itemService.setItemState(ItemKey.Glove, 2);
      itemService.setItemState(ItemKey.Boots, 1);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Glitches );
    });
  });

  describe( 'set to the hammer peg cave', () => {
    const location = DungeonKey.HammerPegCave;

    it( 'starts off as unavailable.', () => {
      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Unavailable );
    });

    it( 'requires more than the moon pearl.', () => {
      itemService.setItemState(ItemKey.MoonPearl, 1);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Unavailable );
    });

    it( 'requires more than the titan\'s mitts.', () => {
      itemService.setItemState(ItemKey.MoonPearl, 1);
      itemService.setItemState(ItemKey.Glove, 2);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Unavailable );
    });

    it( 'can only be gotten with the HAMMER!', () => {
      itemService.setItemState(ItemKey.MoonPearl, 1);
      itemService.setItemState(ItemKey.Glove, 2);
      itemService.setItemState(ItemKey.Hammer, 1);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Available );
    });
  });

  describe( 'set to the bumper cave', () => {
    const location = DungeonKey.BumperCave;

    it( 'starts off as unavailable.', () => {
      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Unavailable );
    });

    it( 'requires outcast access to see the item.', () => {
      itemService.setItemState(ItemKey.Glove, 1);
      itemService.setItemState(ItemKey.Hammer, 1);
      itemService.setItemState(ItemKey.MoonPearl, 1);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Visible );
    });

    it( 'can be gotten with the cape.', () => {
      itemService.setItemState(ItemKey.Glove, 1);
      itemService.setItemState(ItemKey.Hammer, 1);
      itemService.setItemState(ItemKey.MoonPearl, 1);
      itemService.setItemState(ItemKey.Cape, 1);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Available );
    });
  });

  describe( 'set to the pyramid ledge', () => {
    const location = DungeonKey.Pyramid;

    it( 'starts off as unavailable.', () => {
      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Unavailable );
    });

    it( 'can be gotten with Agahnim\'s defeat.', () => {
      dungeonService.getDungeon(DungeonKey.CastleTower).toggleDefeat();

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Available );
    });

    it( 'can be gotten with the glove, hammer, and moon pearl.', () => {
      itemService.setItemState(ItemKey.MoonPearl, 1);
      itemService.setItemState(ItemKey.Hammer, 1);
      itemService.setItemState(ItemKey.Glove, 1);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Available );
    });

    it( 'can be gotten with the mitts, flippers, and moon pearl.', () => {
      itemService.setItemState(ItemKey.MoonPearl, 1);
      itemService.setItemState(ItemKey.Flippers, 1);
      itemService.setItemState(ItemKey.Glove, 2);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Available );
    });

    it( 'can be gotten with the mitts, moon pearl, and boots...if you water walk.', () => {
      itemService.setItemState(ItemKey.MoonPearl, 1);
      itemService.setItemState(ItemKey.Glove, 2);
      itemService.setItemState(ItemKey.Boots, 1);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Glitches );
    });
  });

  describe( 'set to the fairy inside of the pyramid', () => {
    const location = DungeonKey.PyramidFairy;

    it( 'starts off as unavailable.', () => {
      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Unavailable );
    });

    it( 'requires the dungeons with the fairy crystals beaten, though more is still necessary.', () => {
      dungeonService.dungeons.forEach( d => d.toggleDefeat() );

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Unavailable );
    });

    it( 'requires the moon pearl, though still more is needed.', () => {
      dungeonService.dungeons.forEach( d => d.toggleDefeat() );
      itemService.setItemState(ItemKey.MoonPearl, 1);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Unavailable );
    });

    it( 'can be gotten with Agahnim\'s demise and a hammer.', () => {
      dungeonService.dungeons.forEach( d => d.toggleDefeat() );
      itemService.setItemState(ItemKey.MoonPearl, 1);
      itemService.setItemState(ItemKey.Hammer, 1);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Available );
    });
  });

  describe( 'set to the Village of Outcasts bombable hut', () => {
    const location = DungeonKey.BombableHut;

    it( 'starts off as unavailable.', () => {
      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Unavailable );
    });

    it( 'requires more than access to the village', () => {
      itemService.setItemState(ItemKey.Glove, 2);
      itemService.setItemState(ItemKey.MoonPearl, 1);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Unavailable );
    });

    it( 'requires bombs to enter.', () => {
      itemService.setItemState(ItemKey.Glove, 2);
      itemService.setItemState(ItemKey.MoonPearl, 1);
      itemService.setItemState(ItemKey.Bomb, 1);

      expect( itemLocationService.getAvailability( location ) ).toBe( Availability.Available );
    });
  });
});
