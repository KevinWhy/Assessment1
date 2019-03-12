import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, ReplaySubject } from 'rxjs';
import { take } from 'rxjs/operators';

/* Tells HttpClient & other scripts how the config will look.
*/
export interface Config {
  repoOwner: string;
  repoName: string;
}

/* Loads a config file for all the other scripts.
*/
@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private readonly configUrl: string = 'assets/config.json';
  private configSubject: Subject<Config>; // Holds the config
  
  getConfig(): Observable<Config> {
    // Make an Observable that waits until config is set, emits that value once, and complete
    return this.configSubject.pipe(take(1));
  }

  constructor(private http: HttpClient) {
    this.configSubject = new ReplaySubject<Config>(); // Set the value once & emit to all subscribers
    // Read the config file once, & keep it in memory
    this.http.get<Config>(this.configUrl)
      .subscribe((data: Config) =>  this.configSubject.next(data)  );
  }
}
