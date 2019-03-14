import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap';

import { IssueService } from '@app/issue-service/issue.service';
import { PaginatedIssueList } from '@app/issue-service/paginated-issue-list.class';

@Component({
  selector: 'ais-issues-list',
  templateUrl: './issues-list.component.html',
  styleUrls: ['./issues-list.component.scss']
})
export class IssuesListComponent implements OnInit {
  issuesPage: PaginatedIssueList;
  @ViewChild(NgbPagination)
  pageinationElem: NgbPagination;
  
  get isLoadingPage(): boolean {
    return this.issuesPage.currentPage != this.pageinationElem.page;
  }
  
  onChangePage(newPage: number) {
    this.issuesPage.getIssuePage(newPage);
  }

  constructor(private issueService: IssueService) { }

  ngOnInit() {
    this.issuesPage = this.issueService.getIssues();
  }

}
