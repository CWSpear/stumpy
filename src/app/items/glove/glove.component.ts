import { Component, OnInit } from '@angular/core';
import { InventoryService } from '../../inventory.service';
import { Glove } from './glove';

@Component({
  providers: [InventoryService],
  selector: 'stumpy-glove',
  templateUrl: './glove.component.html',
  styleUrls: ['../item.component.css', './glove.component.css']
})
export class GloveComponent implements OnInit {
  constructor(
    private inventoryService: InventoryService
  ) {}

  ngOnInit() {
  }

  getClasses(): any {
    const glove = this.inventoryService.glove;
    return {
      isActive: glove !== Glove.None,
      power: glove !== Glove.Titan,
      titan: glove === Glove.Titan
    };
  }

  whenClicked(evt: MouseEvent) {
    this.inventoryService.incrementGlove();
  }
}
