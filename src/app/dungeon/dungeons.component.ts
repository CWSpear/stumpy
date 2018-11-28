import { Component } from '@angular/core';
import { DungeonKey } from './dungeon-key';

@Component({
  selector: 'stumpy-dungeons',
  templateUrl: './dungeons.component.html',
  styleUrls: ['./dungeons.component.css']
})
export class DungeonsComponent {
  DungeonKey = DungeonKey;
}
