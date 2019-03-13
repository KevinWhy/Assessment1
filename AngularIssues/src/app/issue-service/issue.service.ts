import { Injectable } from '@angular/core';
import * as Octokit from '@octokit/rest';
// To use cached data
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { PaginatedIssueList } from './paginated-issue-list.class';
import { PageRequestOptions, PageResponse } from './page.classes';
import { RateLimit } from './rate-limit.class';

/* Provides issue data to components.
Can also use cached data (mode is decided from environment JSON).
TODO: Use interceptor instead of implementing cached data here
*/
@Injectable({
  providedIn: 'root'
})
export class IssueService {
  private readonly cachedHeadersUrl: string = 'assets/savedResponseHeaders.json';
  private readonly cachedIssuesUrl:  string = 'assets/savedIssuesResponse.json';
  octokit: Octokit;
  
  getRateLimit(): Promise<RateLimit> {
    // Use cached response
    if (environment.useCachedResponses) {
      return new Promise<RateLimit>((resolve) => {  return {
        'current': NaN,
        'limit':   NaN,
        'resetDate': new Date()
      };  });
    }
    // Use live data
    return this.octokit.rateLimit.get().then((resp) => {
      // TODO: Handle failed request?
      // Note: The data.rate object is deprecated. Source: https://developer.github.com/v3/rate_limit/#deprecation-notice
      let numLeft   = Number(resp.data.resources.core.remaining);
      let limit     = Number(resp.data.resources.core.limit);
      let resetTime = Number(resp.data.resources.core.reset);
      return {
        'current': limit -numLeft,
        'limit':   limit,
        'resetDate': new Date(resetTime *1000)
      };
    });
  }
  
  /* Get a list of issues for a repo.
     // TODO: Search filters
  */
  getIssues(pageNum: number = 1): PaginatedIssueList {
    return new PaginatedIssueList(pageNum,
      // When list wants a new page, call function
      (list: PaginatedIssueList, options: PageRequestOptions): Promise<PageResponse> => {
        // Don't make redundant request
        if (!options.requestSamePage && options.pageNum == list.currentPage) {
          return new Promise<PageResponse>((resolve) => {  return {
            pageNum:   list.currentPage,
            pageCount: list.pageCount,
            issues:    list.issues
          };  });
        }
        // Request isn't redundant
        return this.sendIssuesRequest(options);
      }
    ); // End new PaginatedIssueList
  }
  
  /* Helper Functions -------------------------------*/
  
  /* Requests a page of issues from Github API.
  */
  private sendIssuesRequest(options: PageRequestOptions): Promise<PageResponse> {
    // Use cached data
    if (environment.useCachedResponses) {
      console.log("Using cached response for request:", options);
      return this.http.get(this.cachedIssuesUrl)
        .pipe(map(  (issuesJson: Octokit.IssuesListForRepoResponseItem[]): PageResponse => {  return {
          pageNum:   1,
          pageCount: 1,
          issues:    issuesJson
        };  })  )
        .toPromise();
    }
    // Use live data
    // TODO: Cache other page requests?
    return this.octokit.issues.listForRepo({
      owner: environment.repoOwner,
      repo:  environment.repoName,
      page:  options.pageNum
    }).then((resp) => {
      return {
        pageNum:   1, // TODO: Get page numbers!
        pageCount: 1,
        issues:    resp.data
      };
    });
    // TODO: Handle errors
  }
  
  constructor(private http: HttpClient) {
    this.octokit = new Octokit();
    //console.log("octo:",this.octokit);
  }
}
