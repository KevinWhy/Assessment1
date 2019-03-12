import { Component, OnInit } from '@angular/core';

import { IssuesService } from '@app/issues.service';
import { Issue } from '@app/issue.class';

@Component({
  selector: 'ais-issues-list',
  templateUrl: './issues-list.component.html',
  styleUrls: ['./issues-list.component.scss']
})
export class IssuesListComponent implements OnInit {
  issues: Issue[];

  constructor(private issueService: IssuesService) { }

  ngOnInit() {
    this.issueService.getIssues()
      .subscribe((resp: Issue[]) => this.issues = resp);
  }

}
