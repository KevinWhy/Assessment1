import { Component, Input} from '@angular/core';
import { IssuesListForRepoResponseItem } from '@octokit/rest';

/* This component makes a link to the specified issue.
*/
@Component({
  selector: 'ais-issue-assignees',
  templateUrl: './issue-assignees.component.html',
  styleUrls: ['./issue-assignees.component.scss']
})
export class IssueAssigneesComponent {
  @Input()
  issue: IssuesListForRepoResponseItem;
  @Input()
  hidden: boolean = true;
  @Input()
  disabled: boolean = false;
  
  toggleAssigneeVisibility(): void {
    this.hidden = !this.hidden;
  }

  constructor() { }

}
