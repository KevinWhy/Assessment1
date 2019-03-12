import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import {Config, ConfigService} from '@app/config.service';

/* This class wraps the response for a GET request.
*/
export class IssuePage {
  constructor(
    readonly issues: Issue[],
    // Pages are 1-based index
    readonly page:     number,
    readonly lastPage: number
  ) {}
}

@Injectable({
  providedIn: 'root'
})
export class IssuesService {
  private readonly urlPrefix: string = 'https://api.github.com/repos/';
  private readonly urlSuffix: string = '/issues';
  private readonly linkRegex: string = //;
  private issuesUrl: string;
  
  getIssues(): Observable<any> {
    return this.getIssuesUrl()
      .pipe(
        // Convert url Observable into get request
        mergeMap((url: string) => this.http.get<Issue[]>(url, { observe: 'response' })),
        // Parse "Link" header & output IssuePage
        map((response: HttpResponse<Issue[]>) => {
          if (!response.headers.Link) // Links header doesn't exist if there's no pages
            return new IssuePage(issues, 1,1);
          // Links header exists. Parse it
          // TODO: What if parse fails?
          let links = response.headers.Link.split(',');
          for (let link in links) {
            link.match(linkRegex);
          }
        })
      );
  }
  
  /* Converts the config & readonly variables into the issues URL.
  */
  private getIssuesUrl(): Observable<string> {
    return this.configService.getConfig().pipe(
      map((data: Config) => this.urlPrefix +data.repoOwner +'/' +data.repoName +this.urlSuffix)
    );
  }
  
  constructor(
    private configService: ConfigService,
    private http: HttpClient
  ) { }
}
