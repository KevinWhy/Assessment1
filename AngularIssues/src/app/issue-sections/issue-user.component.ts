import { Component, Input } from '@angular/core';
import { IssuesListForRepoResponseItemUser } from '@octokit/rest';

/* This component displays the user's name & avatar.
*/
@Component({
  selector: 'ais-issue-user',
  templateUrl: './issue-user.component.html',
  styleUrls: ['./issue-user.component.scss']
})
export class IssueUserComponent {
  @Input()
  user: IssuesListForRepoResponseItemUser;

  constructor() { }

}
