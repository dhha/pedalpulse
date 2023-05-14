import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GamesDataService {

  constructor(private _http: HttpClient) { }

  public getAll(): Observable<any[]> {
    const url: string = "http://localhost:3000/api/games";
    return this._http.get<any[]>(url);
    // return [
    //   {
    //     _id: 12,
    //     title: "Catan",
    //     price: 39.8
    //   },
    //   {
    //     _id: 3,
    //     title: "Catan 1",
    //     price: 39.8
    //   },
    //   {
    //     _id: 4,
    //     title: "Catan 2",
    //     price: 39.8
    //   }
    // ];
  };

  public getOne(id: string): Observable<any> {
    const url: string = "http://localhost:3000/api/games/" + id;
    return this._http.get<any>(url);
  }
}
