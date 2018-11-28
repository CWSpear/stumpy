import { EntranceLock } from './entrance-lock';
import { DungeonKey } from './dungeon-key';
import { Reward } from './reward';

export class Dungeon {
  constructor(
    private _location: DungeonKey,
    private _dungeonAbbr: string,
    private _dungeonName: string,
    private _bossName: string,
    private _reward: Reward,
    private _maxItemChests: number,
    private _maxTotalChests: number,
    private _maxSmallKeys: number,
    private _entranceLock: EntranceLock = EntranceLock.None
  ) {
    this._itemChestCount = this._maxItemChests;
    this._totalChestCount = this._maxTotalChests;
    this._bossId = this._location;
    this._isBossDefeated = false;
    this._hasBigKey = false;
    this._smallKeyCount = 0;
    this._retroChestCount = this._maxItemChests + this._maxSmallKeys;
  }

  private _bossId: DungeonKey;
  private _itemChestCount: number;
  private _totalChestCount: number;
  private _retroChestCount: number;
  private _smallKeyCount: number;
  private _isBossDefeated: boolean;
  private _hasBigKey: boolean;

  get location(): DungeonKey {
    return this._location;
  }
  get dungeonAbbr(): string {
    return this._dungeonAbbr;
  }
  get dungeonName(): string {
    return this._dungeonName;
  }
  get bossName(): string {
    return this._bossName;
  }
  get maxItemChests(): number {
    return this._maxItemChests;
  }
  get itemChestCount(): number {
    return this._itemChestCount;
  }
  get maxTotalChests(): number {
    return this._maxTotalChests;
  }
  get maxRetroChests(): number {
    return this.maxItemChests + this.maxSmallKeys;
  }
  get totalChestCount(): number {
    return this._totalChestCount;
  }
  get retroChestCount(): number {
    return this._retroChestCount;
  }
  get maxSmallKeys(): number {
    return this._maxSmallKeys;
  }
  get smallKeyCount(): number {
    return this._smallKeyCount;
  }
  get hasSmallKeys(): boolean {
    return this.maxSmallKeys > 0;
  }
  get hasBigKey(): boolean {
    return this._hasBigKey;
  }
  get bossId(): DungeonKey {
    return this._bossId;
  }
  get entranceLock(): EntranceLock {
    return this._entranceLock;
  }
  get medallionName(): string {
    return EntranceLock[this.entranceLock].toLowerCase();
  }
  get isBossDefeated(): boolean {
    return this._isBossDefeated;
  }
  get reward(): Reward {
    return this._reward;
  }
  get hasDungeonEndingReward(): boolean {
    return this.reward !== Reward.None;
  }

  get hasMedallionEntrance(): boolean {
    return this.entranceLock !== EntranceLock.None;
  }

  decrementItemChestCount(): void {
    this._itemChestCount = (this.itemChestCount === 0) ? this.maxItemChests : this.itemChestCount - 1;
  }

  decrementTotalChestCount(): void {
    this._totalChestCount = (this.totalChestCount === 0) ? this.maxTotalChests : this.totalChestCount - 1;
  }

  decrementRetroChestCount(): void {
    this._retroChestCount = (this.retroChestCount === 0) ? this.maxRetroChests : this.retroChestCount - 1;
  }

  incrementSmallKeyCount(): void {
    this._smallKeyCount = (this.smallKeyCount === this.maxSmallKeys) ? 0 : this.smallKeyCount + 1;
  }

  cycleEntranceLock(): void {
    switch ( this.entranceLock ) {
      case EntranceLock.Unknown:
        this._entranceLock = EntranceLock.Bombos;
        break;
      case EntranceLock.Bombos:
        this._entranceLock = EntranceLock.Ether;
        break;
      case EntranceLock.Ether:
        this._entranceLock = EntranceLock.Quake;
        break;
      case EntranceLock.Quake:
        this._entranceLock = EntranceLock.Unknown;
        break;
      default:
        break;
    }
  }

  cycleReward(): void {
    switch ( this.reward ) {
      case Reward.Unknown:
        this._reward = Reward.GreenPendant;
        break;
      case Reward.GreenPendant:
        this._reward = Reward.StandardPendant;
        break;
      case Reward.StandardPendant:
        this._reward = Reward.StandardCrystal;
        break;
      case Reward.StandardCrystal:
        this._reward = Reward.FairyCrystal;
        break;
      case Reward.FairyCrystal:
        this._reward = Reward.Unknown;
        break;
    }
  }

  toggleDefeat(): void {
    this._isBossDefeated = !this.isBossDefeated;
  }

  toggleBigKey(): void {
    this._hasBigKey = !this._hasBigKey;
  }

  cycleBossForward(): void {
    if ( !this.hasDungeonEndingReward ) {
      return;
    }

    const dungeons: DungeonKey[] = Object.keys(DungeonKey) as DungeonKey[];

    const index = dungeons.indexOf(this.bossId);
    const nextIndex = index + 1;

    let next: DungeonKey = dungeons[nextIndex];
    if ( next === DungeonKey.GanonsTower ) {
      next = DungeonKey.EasternPalace;
    }

    this._bossId = next;
  }

  cycleBossBackward(): void {
    if ( !this.hasDungeonEndingReward ) {
      return;
    }

    const dungeons: DungeonKey[] = Object.keys(DungeonKey) as DungeonKey[];

    const index = dungeons.indexOf(this.bossId);
    const prevIndex = index - 1;

    let prev: DungeonKey = dungeons[prevIndex];
    if ( prev === DungeonKey.CastleTower ) {
      prev = DungeonKey.TurtleRock;
    }

    this._bossId = prev;
  }

  reset(): void {
    this._itemChestCount = this.maxItemChests;
    this._totalChestCount = this.maxTotalChests;
    this._smallKeyCount = 0;
    this._isBossDefeated = false;
    this._bossId = this._location;
    this._hasBigKey = false;
    if ( this._reward !== Reward.None ) {
      this._reward = Reward.Unknown;
    }
    if ( this.entranceLock !== EntranceLock.None ) {
      this._entranceLock = EntranceLock.Unknown;
    }
  }
}
