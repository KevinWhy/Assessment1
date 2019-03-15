import { Component, Input} from '@angular/core';
import { IssuesListForRepoResponseItem } from '@octokit/rest';

import { IssueService } from '@app/issue-service/issue.service';

/* This component makes a link to the specified issue.
*/
@Component({
  selector: 'ais-issue-title',
  templateUrl: './issue-title.component.html',
  styleUrls: ['./issue-title.component.scss']
})
export class IssueTitleComponent {
  @Input()
  issue: IssuesListForRepoResponseItem;
  
  get issueUrl(): string {
    if (!this.issue)
      return null;
    return this.issueService.getRepoUrl()+ '/issues/'+ this.issue.number;
  }

  constructor(private issueService: IssueService) { }

}
