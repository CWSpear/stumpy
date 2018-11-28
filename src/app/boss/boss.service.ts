import { Injectable } from '@angular/core';

import { DungeonKey } from '../dungeon/dungeon-key';

import { ItemService } from '../items/item.service';
import { SettingsService } from '../settings/settings.service';

@Injectable()
export class BossService {
  constructor(
    private _settings: SettingsService,
    private _items: ItemService
  ) {
    this._bossMap = new Map<DungeonKey, () => boolean>(
      [
        [ DungeonKey.CastleTower, this.canDefeatAgahnim ],
        [ DungeonKey.EasternPalace, this.canDefeatArmosKnights ],
        [ DungeonKey.DesertPalace, this.canDefeatLanmolas ],
        [ DungeonKey.TowerOfHera, this.canDefeatMoldorm ],
        [ DungeonKey.PalaceOfDarkness, this.canDefeatHelmasaurKing ],
        [ DungeonKey.SwampPalace, this.canDefeatArrghus ],
        [ DungeonKey.SkullWoods, this.canDefeatMothula ],
        [ DungeonKey.ThievesTown, this.canDefeatBlind ],
        [ DungeonKey.IcePalace, this.canDefeatKholdstare ],
        [ DungeonKey.MiseryMire, this.canDefeatVitreous ],
        [ DungeonKey.TurtleRock, this.canDefeatTrinexx ],
        [ DungeonKey.GanonsTower, this.canDefeatAgahnim ]
      ]
    );
  }

  private _bossMap: Map<DungeonKey, () => boolean>;

  private canDefeatAgahnim(): boolean {
    return !!this._items.net || !!this._items.hammer
      || this._items.hasSword();
  }

  private canDefeatArmosKnights(): boolean {
    const items = this._items;
    return items.hasMeleeOrBow() || items.hasRod() ||
      items.hasCane() || !!items.boomerang || !!items.bomb;
  }

  private canDefeatLanmolas(): boolean {
    const items = this._items;
    return items.hasMeleeOrBow() || items.hasRod() ||
      items.hasCane() || !!items.bomb;
  }

  private canDefeatMoldorm(): boolean {
    return this._items.hasMelee();
  }

  private canDefeatHelmasaurKing(): boolean {
    const items = this._items;
    if ( !!items.hammer ) {
      return true;
    }

    return !!items.bomb && items.hasMeleeOrBow();
  }

  private canDefeatArrghus(): boolean {
    const items = this._items;
    if ( !items.hookshot ) {
      return false;
    }

    return items.hasMeleeOrBow() || items.hasRod() ||
      items.hasCane() || !!items.bomb;
  }

  private canDefeatMothula(): boolean {
    const items = this._items;
    return items.hasMelee() || items.hasCane() || !!items.fireRod;
  }

  private canDefeatBlind(): boolean {
    const items = this._items;
    return items.hasMelee() || items.hasCane();
  }

  private canDefeatKholdstare(): boolean {
    const items = this._items;
    let hasBombos = false;
    if ( !this._settings.isSwordless() ) {
      hasBombos = !!items.bombos;
    }

    const canDefeatBlock = hasBombos || !!items.fireRod;
    const canDefeatCloud = !!items.fireRod || items.hasMelee();

    return canDefeatBlock && canDefeatCloud;
  }

  private canDefeatVitreous(): boolean {
    const items = this._items;
    return items.hasMeleeOrBow() || !!items.bomb;
  }

  private canDefeatTrinexx(): boolean {
    const items = this._items;
    if ( !items.fireRod || !items.iceRod ) {
      return false;
    }

    return items.hasMelee();
  }

  canDefeatBoss(location: DungeonKey): boolean {
    return this._bossMap.get(location).call(this);
  }
}
