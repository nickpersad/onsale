import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { faChevronDown, faChevronRight, faTimes, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { Observable, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Metadata } from '../../models/data';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  providers: [FormBuilder],
})
export class SidebarComponent implements OnInit, OnDestroy {
  @Input() status = false;
  @Output() statusEmitter = new EventEmitter<boolean>();
  @Output() filter = new EventEmitter<string>();
  faTimes: IconDefinition = faTimes;
  faChevronRight: IconDefinition = faChevronRight;
  faChevronDown: IconDefinition = faChevronDown;
  metaData$: Observable<Metadata> = null;
  formGroup: FormGroup;
  formSubscription: Subscription;

  sort = [
    { name: 'Ascending', value: 'asc', label: 'ascending' },
    { name: 'Descending', value: 'desc', label: 'descending' },
  ];
  companies: string[] = [];
  titles: string[] = [];
  filterQuery = '';

  constructor(private formBuilder: FormBuilder, private dataService: DataService) {}

  updateFilterQuery(): void {
    const sort = this.formGroup.get('sort')?.value;
    const titles = this.titles.length > 0 ? `&titles=${encodeURIComponent(this.titles.join(','))}` : '';
    const companies = this.companies.length > 0 ? `&companies=${encodeURIComponent(this.companies.join(','))}` : '';

    this.filter.emit(`&sort=${sort}${titles}${companies}`);
  }

  updateStatus(): void {
    this.statusEmitter.emit(true);
  }

  updateFilters(event: Event, title: string, key: string): void {
    const input = event.target as HTMLInputElement;
    const isChecked = input.checked;
    if (isChecked && !this[key].includes(title)) {
      this[key].push(title);
    } else {
      const index = this[key].indexOf(title);
      if (index > -1) {
        this[key].splice(index, 1);
      }
    }
    this.updateFilterQuery();
  }

  ngOnInit(): void {
    this.metaData$ = this.dataService.getMetaData();
    this.formGroup = this.formBuilder.group({
      sort: this.formBuilder.control('asc'),
      companies: this.formBuilder.control(null),
      titles: this.formBuilder.control(null),
    });

    this.formSubscription = this.formGroup.valueChanges.pipe(tap((_) => this.updateFilterQuery())).subscribe();
  }

  ngOnDestroy(): void {
    this.formSubscription.unsubscribe();
  }
}
