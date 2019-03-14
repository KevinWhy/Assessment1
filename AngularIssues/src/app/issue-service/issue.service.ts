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
/*
    // Use cached response
    if (environment.useCachedResponses) {
      return new Promise<RateLimit>((resolve) => resolve(  {
        'remaining': NaN,
        'limit':     NaN,
        'resetDate': new Date()
      }  ));
    }
*/
    // Use live data
    return this.octokit.rateLimit.get().then((resp) => {
      // TODO: Handle failed request?
      // Note: The data.rate object is deprecated. Source: https://developer.github.com/v3/rate_limit/#deprecation-notice
      let numLeft   = Number(resp.data.resources.core.remaining);
      let limit     = Number(resp.data.resources.core.limit);
      let resetTime = Number(resp.data.resources.core.reset);
      return {
        'remaining': numLeft,
        'limit':     limit,
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
  */
  private sendIssuesRequest(options: PageRequestOptions): Promise<PageResponse> {
    // Use cached data
    if (environment.useCachedResponses) {
      console.log("Using cached response for request:", options);
      return this.http.get(this.cachedIssuesUrl)
        .pipe(map(  (issuesJson: Octokit.IssuesListForRepoResponseItem[]): PageResponse => {
          issuesJson[0].title = 'PAGE '+ options.pageNum +'__'+ issuesJson[0].title; // Modify issuesJson a bit to show current page number
          return {
            pageNum:   options.pageNum,
            pageCount: 23,
            issues:    issuesJson
          };
        })  )
        .toPromise();
    }
    // Use live data
    // TODO: Cache other page requests?
    return this.octokit.issues.listForRepo({
      owner: environment.repoOwner,
      repo:  environment.repoName,
      page:  options.pageNum
    }).then((resp) => {
      const pageCount: number = this.getPageCount(options.pageNum, resp);
      return {
        pageNum:   options.pageNum,
        pageCount: pageCount,
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
