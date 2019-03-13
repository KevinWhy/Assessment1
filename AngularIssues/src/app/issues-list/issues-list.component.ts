import { Component, OnInit } from '@angular/core';

import { IssueService } from '@app/issue-service/issue.service';
import { RateLimit } from '@app/issue-service/rate-limit.class';
import { PaginatedIssueList } from '@app/issue-service/paginated-issue-list.class';

@Component({
  selector: 'ais-issues-list',
  templateUrl: './issues-list.component.html',
  styleUrls: ['./issues-list.component.scss']
})
export class IssuesListComponent implements OnInit {
  issuesPage: PaginatedIssueList;

  constructor(private issueService: IssueService) { }

  ngOnInit() {
    this.issuesPage = this.issueService.getIssues();
    this.issueService.getRateLimit().then((limit: RateLimit) => {
      console.log("LIMIT:",limit);
    });
  }

}
