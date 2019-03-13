import { IssuesListForRepoResponseItem } from '@octokit/rest';

/* Used to pass request info from PaginatedIssueList to this service.
   Should only be used by those two classes.
*/
export interface PageRequestOptions {
  pageNum: number;
  // If true, will ignore Paged IssuesList's currentPage when getting request. Does NOT override environment.useCachedResponses
  requestSamePage: boolean;
}

/* Defined an interface that's easier to emulate than Octokit's Response object.
*/
export interface PageResponse {
  pageNum: number;
  pageCount: number;
  issues: IssuesListForRepoResponseItem[];
}
