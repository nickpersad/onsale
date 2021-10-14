import { Component, Input } from "@angular/core";
import { Item } from "src/app/models/data";
import { faStar, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { BehaviorSubject } from "rxjs";
import { switchMap } from "rxjs/operators";

@Component({
  selector: "app-card",
  templateUrl: "./card.component.html",
  styleUrls: ["./card.component.scss"],
})
export class CardComponent {
  constructor() {
    this.init();
  }

  @Input() item: Item = null;
  faStar: IconDefinition = faStar;
  private readonly favorites = new BehaviorSubject<Item[]>([]);
  private getFavorites(): any[] {
    const entities = localStorage.getItem("onSaleFavorites");

    return entities ? JSON.parse(entities) : [];
  }

  private init(): void {
    this.favorites.next(this.getFavorites());
  }

  updateFavorite(item: Item) {
    const favorites = this.favorites.getValue();
    const filtered = favorites
      .filter((value) => value.title !== item.title)
      .slice(0, 2);
    const updated = [item, ...filtered];
console.log(updated)
    this.favorites.next(updated);

    localStorage.setItem("onSaleFavorites", JSON.stringify(updated));
  }
}
