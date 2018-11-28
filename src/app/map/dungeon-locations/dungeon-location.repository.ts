import { DungeonLocation } from './dungeon-location';
import { DungeonKey } from '../../dungeon/dungeon-key';

export const DungeonLocations: Map<DungeonKey, DungeonLocation> = new Map<DungeonKey, DungeonLocation>(
  [ [
    DungeonKey.CastleTower, new DungeonLocation(
      'Agahnim\'s Tower',
      '{sword2} or {cape} + {sword1}',
      50,
      52.6
    )
  ], [
    DungeonKey.EasternPalace, new DungeonLocation(
      'Eastern Palace',
      '{lantern}',
      94.6,
      38.8
    )
  ], [
    DungeonKey.DesertPalace, new DungeonLocation(
      'Desert Palace',
      '{book} or {glove2} + {mirror}',
      7.6,
      78.4
    )
  ], [
    DungeonKey.TowerOfHera, new DungeonLocation(
      'Tower of Hera',
      '',
      62,
      5.5
    )
  ], [
    DungeonKey.PalaceOfDarkness, new DungeonLocation(
      'Palace of Darkness',
      '{lantern} + {bow}',
      94,
      40
    )
  ], [
    DungeonKey.SwampPalace, new DungeonLocation(
      'Swamp Palace',
      '{mirror} + {flippers}',
      47,
      91
    )
  ], [
    DungeonKey.SkullWoods, new DungeonLocation(
      'Skull Woods',
      '',
      6.6,
      5.4
    )
  ], [
    DungeonKey.ThievesTown, new DungeonLocation(
      'Thieves Town',
      '',
      12.8,
      47.9
    )
  ], [
    DungeonKey.IcePalace, new DungeonLocation(
      'Ice Palace',
      '',
      79.6,
      85.8
    )
  ], [
    DungeonKey.MiseryMire, new DungeonLocation(
      'Misery Mire',
      '{lantern} + medallion',
      11.6,
      82.9
    )
  ], [
    DungeonKey.TurtleRock, new DungeonLocation(
      'Turtle Rock',
      '{lantern} + medallion',
      93.8,
      7
    )
  ], [
    DungeonKey.GanonsTower, new DungeonLocation(
      'Ganon\'s Tower',
      '7 crystals',
      58,
      5.5
    )
  ] ]
);
