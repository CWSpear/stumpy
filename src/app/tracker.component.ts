import { Component } from '@angular/core';
import { ItemKey } from './items/item-key';

@Component({
  selector: 'stumpy-tracker',
  templateUrl: './tracker.component.html'
})

export class RandomizerTrackerComponent {
  ItemKey = ItemKey;
}
