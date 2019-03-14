import { IssuesListForRepoResponseItem } from '@octokit/rest';
import { Observable, Subject } from 'rxjs';

import { PageRequestOptions, PageResponse } from './page.classes';

/* This class is used by components to see requests that have been returned.
   It also lets user change which page of requests they want to see.
*/
export class PaginatedIssueList {
  get currentPage(): number {  return this._currentPage;  }
  get pageCount(): number {  return this._pageCount;  }
  readonly issues: Observable<IssuesListForRepoResponseItem[]>;

  private _pageCount: number; // Total # of pages
  private _issues: Subject<IssuesListForRepoResponseItem[]>; // TODO: Clean up subject when list is dropped

  /* Change the page that this list is looking at.
     TODO: Stop calls until page count acquired
  */
  // Users shouldn't have access to other PageRequestOptions
  getIssuePage(pageNum: number = 1): Observable<IssuesListForRepoResponseItem[]> {
    if (pageNum < 1 || pageNum > this.pageCount) // UI should prevent this case
      return;
    this.requestIssues({pageNum: pageNum, requestSamePage: false});
    return this.issues;
  }
  
  /* Helper method. Lets other class methods specify all options for request. 
  */
  requestIssues(options: PageRequestOptions): void {
    this.sendPageRequest(this, options)
      .then((resp: PageResponse) => {
        this._currentPage = resp.pageNum;
        this._pageCount = resp.pageCount;
        this._issues.next(resp.issues);
      });
  }
  
  /* Create a list of issues that has the ability to change which page it's looking at.
       sendPageRequest - Should return pageNum's list of issues.
     Note: pageNum can == list's currentPage
  */
  constructor(
    private _currentPage: number,
    private sendPageRequest: (list: PaginatedIssueList, options: PageRequestOptions) => Promise<PageResponse>
  ) {
    this._issues = new Subject<IssuesListForRepoResponseItem[]>();
    this.issues = this._issues.asObservable(); // Hide source from other classes
    this.requestIssues({pageNum: _currentPage, requestSamePage: true});
  }
}
