import { Component, OnInit } from '@angular/core';

import { IssuesService, RateLimit } from '@app/issues.service';

@Component({
  selector: 'ais-issues-list',
  templateUrl: './issues-list.component.html',
  styleUrls: ['./issues-list.component.scss']
})
export class IssuesListComponent implements OnInit {
  issues: any[];

  constructor(private issueService: IssuesService) { }

  ngOnInit() {
    this.issueService.getRateLimit().then((limit: RateLimit) => {
      console.log("LIMIT:",limit);
    });
    console.log("Starting req!");
    this.issueService.getIssues()
      .then((resp) => { // TODO: Handle errors
        this.issues = resp.data;
      });
  }

}
