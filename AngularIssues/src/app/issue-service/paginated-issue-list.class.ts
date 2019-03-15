import { IssuesListForRepoResponseItem } from '@octokit/rest';
import { Observable, Subject } from 'rxjs';

import { PageRequestOptions, PageResponse } from './page.classes';

export enum ListStatus {
  Getting, Loaded, Failed
}
export enum FailReason {
  NoError, LimitExceeded, NetworkError, Unknown
}

/* This class is used by components to see requests that have been returned.
   It also lets user change which page of requests they want to see.
*/
export class PaginatedIssueList {
  get currentPage(): number {  return this._currentPage;  }
  get pageCount(): number {  return this._pageCount;  }
  get status(): ListStatus {  return this._status;  }
  get failReason(): FailReason {  return this._failReason;  }
  readonly issues: Observable<IssuesListForRepoResponseItem[]>;

  private _pageCount: number; // Total # of pages
  private _issues: Subject<IssuesListForRepoResponseItem[]>; // TODO: When implementing sarch filters, clean up subject when list is dropped
  private _status: ListStatus;
  private _failReason: FailReason;

  /* Change the page that this list is looking at.
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
    this._status = ListStatus.Getting;
    this._failReason = FailReason.NoError;
    this.sendPageRequest(this, options)
      .then((resp: PageResponse) => {
        this._currentPage = resp.pageNum;
        this._pageCount = resp.pageCount;
        this._status = ListStatus.Loaded;
        this._issues.next(resp.issues);
      })
      // Update internal state
      .catch((err) => {
        this._status = ListStatus.Failed;
        // Handle network errors
        if (err.name == "HttpError") {
          if (err.status == 403)
            this._failReason = FailReason.LimitExceeded;
          else
            this._failReason = FailReason.NetworkError;
          console.error("Failed to get issues.",
            "Status Code:", err.status,
            "Reason:",err.message
          );
          throw err;
        }
        // Don't know why request failed
        this._failReason = FailReason.Unknown;
        console.error("Failed to get issues.",
          "Unrecognized Reason:",err.message
        );
        throw err;
      // No matter how internal state looks, update issues list
      }).catch((err) => {
        this._issues.next([]);
        throw err;
      });
  }
  
  /* Create a list of issues that has the ability
     to change which page it's looking at.
       sendPageRequest - Should return pageNum's list of issues.
  */
  constructor(
    private _currentPage: number,
    private sendPageRequest: (list: PaginatedIssueList, options: PageRequestOptions) => Promise<PageResponse>
  ) {
    this._issues = new Subject<IssuesListForRepoResponseItem[]>();
    this.issues = this._issues.asObservable(); // Hide source from other classes
    // Request also sets status & fail reason
    this.requestIssues({pageNum: _currentPage, requestSamePage: true});
  }
}
