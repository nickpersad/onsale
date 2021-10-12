import { Component, Input } from '@angular/core';
import { Item } from 'src/app/models/data';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent {
  @Input() item: Item = null;
}
