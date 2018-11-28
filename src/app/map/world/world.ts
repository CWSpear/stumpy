import { LocationKey } from '../item-locations/location-key';
import { DungeonKey } from '../../dungeon/dungeon-key';

export class World {
  constructor(
    private _name: string,
    private _itemLocationIds: Array<LocationKey>,
    private _dungeonLocationIds: Array<DungeonKey>
  ) {}

  get name(): string {
    return this._name;
  }

  get itemLocationIds(): Array<LocationKey> {
    return this._itemLocationIds;
  }

  get dungeonLocationIds(): Array<DungeonKey> {
    return this._dungeonLocationIds;
  }
}
