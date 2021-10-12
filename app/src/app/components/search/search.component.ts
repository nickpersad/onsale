import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent {
  @Output() query = new EventEmitter<string>();

  updateQuery(query: string): void {
    this.query.emit(query);
  }
}
