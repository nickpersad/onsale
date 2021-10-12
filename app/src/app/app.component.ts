import { Component, OnDestroy, OnInit } from '@angular/core';
import { faBars, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { BehaviorSubject, Subscription } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { Constants } from './constants';
import { Search } from './models/data';
import { DataService } from './services/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  status = false;
  finished = false;
  faBars: IconDefinition = faBars;
  items$ = new BehaviorSubject([]);
  loading$ = new BehaviorSubject(false);
  dataSubscription: Subscription;
  params = {
    skip: 0,
    filter: '',
    q: '',
  };

  constructor(private dataService: DataService) {}

  updateStatus(status = false) {
    this.status = status;
  }

  updateParams(value: string, key: string) {
    this.loading$.next(true);
    this.finished = false;
    this.params.skip = 0;
    this.params[key] = value;
    this.dataSubscription.unsubscribe();
    this.items$.next([]);
    this.getNewData();
  }

  ngOnInit(): void {
    this.loading$.next(true);
    this.getNewData();
  }

  onScroll() {
    this.loading$.next(true);
    this.params.skip = this.params.skip + Constants.Take;
    this.dataSubscription.unsubscribe();
    this.getNewData();
  }

  private getNewData() {
    if (this.finished) return;

    this.dataSubscription = this.dataService
      .getData(this.params)
      .pipe(
        take(1),
        tap((newData: Search) => {
          const results: any[] = newData.results;
          const count = newData.count;
          const currentData = this.items$.getValue();

          if (currentData.length + newData.results.length === count) {
            this.finished = true;
          }
          this.items$.next(currentData.concat(...results));
        }),
        tap((_) => this.loading$.next(false))
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }
}
