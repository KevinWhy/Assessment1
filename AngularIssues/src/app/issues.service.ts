import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as Octokit from '@octokit/rest';
import { map } from 'rxjs/operators';

import { environment } from '@environments/environment';

/* Tells other scripts how many requests they can still send...
*/
export interface RateLimit {
  readonly current: number; // # of requests sent.
  readonly limit: number;   // Max # of requests you can send
  readonly resetDate: Date; // When the limit resets
}

/* Provides issue data to components.
Can also use cached data (mode is decided from environment JSON).
TODO: Use interceptor instead of implementing cached data here
*/
@Injectable({
  providedIn: 'root'
})
export class IssuesService {
  private readonly cachedIssuesUrl: string = 'assets/savedIssuesResponse.json';
  octokit: Octokit;
  
  getRateLimit(): Promise<RateLimit> {
    // Use cached response
    // TODO: Format as Octokit.RateLimitGetResponse?
    console.log("envRate:",environment);
    if (environment.useCachedResponses) {
      return new Promise<RateLimit>((resolve) => {  return {
        'current': 40,
        'limit':   60,
        'resetDate': new Date()
      };  });
    }
    // Use live data
    return this.octokit.rateLimit.get().then((resp) => {
      // TODO: Request fail?
      let numLeft   = Number(resp.data.rate.remaining);
      let limit     = Number(resp.data.rate.limit);
      let resetTime = Number(resp.data.rate.reset);
      return {
        'current': limit -numLeft,
        'limit':   limit,
        'resetDate': new Date(resetTime *1000)
      };
    });
  }
  
  /* Returns a promise of the specified issues.
  */
  getIssues(): Promise<any> {
    // Use cached data
    // TODO: Format to Octokit.IssuesListResponse?
    console.log("envIssues:",environment);
    if (environment.useCachedResponses) {
      return this.http.get(this.cachedIssuesUrl)
        // Wrap JSON in a response-like object
        .pipe(map((issuesJson: any[]) => {  return {
          data: issuesJson,
          headers: undefined,
          status: 200,
          url: this.cachedIssuesUrl
        };  }))
        .toPromise();
    }
    
    // Use live data
    return new Promise((resolve) => {
      // Can't paginate. It breaks the rate limit.
      resolve([]); // DEBUG
/*
      this.configService.getConfig().subscribe((data: Config) => {
        const endpoint = this.octokit.issues.listForRepo.endpoint.merge({
          owner: data.repoOwner,
          repo:  data.repoName,
        });
        resolve(this.octokit.paginate(endpoint, {method: 'HEAD'}));
      }); // End subscribe
*/
    }); // End promise
  }
  
  constructor(private http: HttpClient) {
    this.octokit = new Octokit();
    console.log("octo:",this.octokit);
    console.log("env:",environment);
    this.octokit.rateLimit.get().then((resp)=>
    console.log("octo rate:",resp)
    );
  }
}
