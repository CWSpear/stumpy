import { Dungeon } from './dungeon';
import { EntranceLock } from './entrance-lock';
import { DungeonKey } from './dungeon-key';
import { Reward } from './reward';

export const Dungeons = new Map<DungeonKey, Dungeon>(
  [ [
    DungeonKey.CastleTower, new Dungeon(
      DungeonKey.CastleTower,
      'CT',
      'Agahnim\'s Tower',
      'Agahnim',
      Reward.None,
      0,
      2,
      2
    )
  ], [
    DungeonKey.EasternPalace, new Dungeon(
      DungeonKey.EasternPalace,
      'EP',
      'Eastern Palace',
      'Armos Knights',
      Reward.Unknown,
      3,
      6,
      0
    )
  ], [
    DungeonKey.DesertPalace, new Dungeon(
      DungeonKey.DesertPalace,
      'DP',
      'Desert Palace',
      'Lanmolas',
      Reward.Unknown,
      2,
      6,
      1
    )
  ], [
    DungeonKey.TowerOfHera, new Dungeon(
      DungeonKey.TowerOfHera,
      'ToH',
      'Tower of Hera',
      'Moldorm',
      Reward.Unknown,
      2,
      6,
      1
    )
  ], [
    DungeonKey.PalaceOfDarkness, new Dungeon(
      DungeonKey.PalaceOfDarkness,
      'PoD',
      'Palace of Darkness',
      'Helmasaur King',
      Reward.Unknown,
      5,
      14,
      6
    )
  ], [
    DungeonKey.SwampPalace, new Dungeon(
      DungeonKey.SwampPalace,
      'SP',
      'Swamp Palace',
      'Arrghus',
      Reward.Unknown,
      6,
      10,
      1
    )
  ], [
    DungeonKey.SkullWoods, new Dungeon(
      DungeonKey.SkullWoods,
      'SW',
      'Skull Woods',
      'Mothula',
      Reward.Unknown,
      2,
      8,
      3
    )
  ], [
    DungeonKey.ThievesTown, new Dungeon(
      DungeonKey.ThievesTown,
      'TT',
      'Thieves Town',
      'Blind',
      Reward.Unknown,
      4,
      8,
      1
    )
  ], [
    DungeonKey.IcePalace, new Dungeon(
      DungeonKey.IcePalace,
      'IP',
      'Ice Palace',
      'Kholdstare',
      Reward.Unknown,
      3,
      8,
      2
    )
  ], [
    DungeonKey.MiseryMire, new Dungeon(
      DungeonKey.MiseryMire,
      'MM',
      'Misery Mire',
      'Vitreous',
      Reward.Unknown,
      2,
      8,
      3,
      EntranceLock.Unknown
    )
  ], [
    DungeonKey.TurtleRock, new Dungeon(
      DungeonKey.TurtleRock,
      'TR',
      'Turtle Rock',
      'Trinexx',
      Reward.Unknown,
      5,
      12,
      4,
      EntranceLock.Unknown
    )
  ], [
    DungeonKey.GanonsTower, new Dungeon(
      DungeonKey.GanonsTower,
      'GT',
      'Ganon\'s Tower',
      'Agahnim 2',
      Reward.None,
      20,
      27,
      4
    )
  ] ]
);
