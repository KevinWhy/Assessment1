import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { IssuesListForRepoResponseItem } from '@octokit/rest';

import { IssueService } from '@app/issue-service/issue.service';
import { PaginatedIssueList } from '@app/issue-service/paginated-issue-list.class';
import { IssueModalComponent } from '@app/issue-modal/issue-modal.component';

@Component({
  selector: 'ais-issues-list',
  templateUrl: './issues-list.component.html',
  styleUrls: ['./issues-list.component.scss']
})
export class IssuesListComponent implements OnInit {
  issuesPage: PaginatedIssueList;
  @Input()
  numColumns: 4;
  @ViewChild(NgbPagination)
  pageinationElem: NgbPagination;
  @ViewChild(IssueModalComponent)
  issueModal: IssueModalComponent;
  
  get isLoadingPage(): boolean {
    return this.issuesPage.currentPage != this.pageinationElem.page;
  }
  
  onChangePage(newPage: number) {
    this.issuesPage.getIssuePage(newPage);
  }
  expandIssue(issue: IssuesListForRepoResponseItem) {
    this.issueModal.showIssue(issue);
  }
  
  /* ------------------------------------------ */

  constructor(private issueService: IssueService) { }

  ngOnInit() {
    this.issuesPage = this.issueService.getIssues();
  }

}
