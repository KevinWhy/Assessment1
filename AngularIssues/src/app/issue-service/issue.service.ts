import { Injectable } from '@angular/core';
import * as Octokit from '@octokit/rest';
import { Observable, BehaviorSubject } from 'rxjs';
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
  octokit: Octokit;
  readonly limitInfo: Observable<RateLimit>;
  private _limitInfo: BehaviorSubject<RateLimit>;
  
  getRepoUrl(): string {
    return 'https://github.com/'+ environment.repoOwner +'/'+ environment.repoName;
  }
  
  /* Get a list of issues for a repo.
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
  
  /* To test error mssages for maxed-out rate limit.
  */
  maxOutRateLimit(isContinuingReq: boolean = false): void {
    if (environment.useCachedResponses) {
      console.error("Using cached responses, so app cannot max out rate limit.");
      return;
    }
    if (!environment.production) {
      if (isContinuingReq)
        console.log("\tSending another batch of requests...");
      else
        console.log("Maxing out rate limit...");
      this.octokit.paginate(
        this.octokit.issues.listForRepo.endpoint.merge({
          owner: environment.repoOwner,
          repo:  environment.repoName
        })
      )
        .then((resp) => {
          console.log("Request batch completed:", resp);
          this.updateLimitInfo();
          this.maxOutRateLimit(true);
        })
        .catch((err) => {
          console.log("Limit might've been reached!", err);
          this.updateLimitInfo();
        })
      
    }
  }
  
  /* Helper Functions -------------------------------*/
  
  /* Figures out how many pages there are for this response
  */
  private getPageCount(requestPageNum: number, resp: any): number {
    // Get links from request. Code from: https://github.com/gr2m/octokit-pagination-methods/blob/master/lib/get-page-links.js
    let linkHeader = resp.link || resp.headers.link || '';
    const links = {};
    // link format:
    // '<https://api.github.com/users/aseemk/followers?page=2>; rel="next", <https://api.github.com/users/aseemk/followers?page=2>; rel="last"'
    linkHeader.replace(/<([^>]*)>;\s*rel="([\w]*)"/g, (m, uri, linkType) => {
        links[linkType] = uri;
    })
    
    // If last link not found, either: Has no pages (reqPage == 1) or at last page already
    if (!links['last'])
      return requestPageNum;
    // Has last link, so return page 
    return Number(  links['last'].match(/page=(\d+)/)[1]  );
  }
  
  /* Requests a page of issues from Github API.
     TODO: Dynamic search filters
  */
  private sendIssuesRequest(options: PageRequestOptions): Promise<PageResponse> {
    // Use cached data
    if (environment.useCachedResponses) {
      console.log("Using cached response for request:", options);
      return this.http.get(environment.cachedIssuesUrl)
        .pipe(map(  (issuesJson: Octokit.IssuesListForRepoResponseItem[]): PageResponse => {
          // Modify issuesJson a bit to show current page number
          issuesJson[0].title = 'PAGE '+ options.pageNum +'__'+ issuesJson[0].title;
          this.updateLimitInfo();
          return {
            pageNum:   options.pageNum,
            pageCount: 23,
            issues:    issuesJson
          };
        })  )
        .toPromise();
    }
    // Use live data
    let earliestUpdateDate = new Date();
    earliestUpdateDate.setDate(  earliestUpdateDate.getDate() -7  );
    // TODO: Cache other page requests?
    return this.octokit.issues.listForRepo({
      owner: environment.repoOwner,
      repo:  environment.repoName,
      since: earliestUpdateDate.toISOString(), // Right now, search filter is hard-coded
      page:  options.pageNum
    }).then((resp) => {
      const pageCount: number = this.getPageCount(options.pageNum, resp);
      this.updateLimitInfo(); // Notice: This runs after issues acquired
      return {
        pageNum:   options.pageNum,
        pageCount: pageCount,
        issues:    resp.data
      };
    });
  }
  
  /* Update limitInfo observable.
  */
  private updateLimitInfo(): void {
    // Use cached response
    if (environment.useCachedResponses) {
      this._limitInfo.next({
        'remaining': NaN,
        'limit':     NaN,
        'resetDate': new Date()
      });
    // Use live data
    } else {
      this.octokit.rateLimit.get().then((resp) => {
        // TODO: Handle failed request?
        // Note: I don't use data.rate because it is deprecated. Source: https://developer.github.com/v3/rate_limit/#deprecation-notice
        let numLeft   = Number(resp.data.resources.core.remaining);
        let limit     = Number(resp.data.resources.core.limit);
        let resetTime = Number(resp.data.resources.core.reset);
        this._limitInfo.next({
          'remaining': numLeft,
          'limit':     limit,
          'resetDate': new Date(resetTime *1000)
        });
      });
    }
  }
  
  constructor(private http: HttpClient) {
    this.octokit = new Octokit();
    this._limitInfo = new BehaviorSubject<RateLimit>({
      remaining: undefined, limit: undefined, resetDate: undefined
    });
    // Hide source from listeners
    this.limitInfo = this._limitInfo.asObservable();
    this.updateLimitInfo();
  }
}
