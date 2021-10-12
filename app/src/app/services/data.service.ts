import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Constants } from '../constants';
import { Metadata, Search } from '../models/data';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private readonly metadataUrl = `${Constants.Api}/metadata`;
  private readonly searchUrl = `${Constants.Api}/search`;

  constructor(private httpClient: HttpClient) {}

  getMetaData(): Observable<Metadata> {
    return this.httpClient.get<Metadata>(`${this.metadataUrl}`);
  }

  getData({ skip, filter, q }): Observable<Search> {
    return this.httpClient.get<Search>(`${this.searchUrl}?skip=${skip}&take=${Constants.Take}${filter}&q=${q}`);
  }
}
