import { WorldId } from './world-id';
import { World } from './world';
import { LocationKey } from '../item-locations/location-key';
import { DungeonKey } from '../../dungeon/dungeon-key';

export const Worlds = new Map<WorldId, World>(
  [ [
    WorldId.Light, new World(
      'light',
      Object.keys(LocationKey).slice(0, 48) as LocationKey[],
      Object.keys(DungeonKey).slice(0, 4) as DungeonKey[],
    )
  ], [
    WorldId.Dark, new World(
      'dark',
      Object.keys(LocationKey).slice(48, 48 + 17) as LocationKey[],
      Object.keys(DungeonKey).slice(4, 4 + 8) as DungeonKey[],
    )
  ] ]
);
