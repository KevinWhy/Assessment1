import { Component, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IssuesListForRepoResponseItem } from '@octokit/rest';

import { IssueAssigneesComponent } from '@app/issue-sections/issue-assignees.component';

@Component({
  selector: 'ais-issue-modal',
  templateUrl: './issue-modal.component.html',
  styleUrls: ['./issue-modal.component.scss']
})
export class IssueModalComponent {
  private modalIssue: IssuesListForRepoResponseItem = undefined;
  assigneesHidden: boolean = true;
  @ViewChild('issueModal')
  modal: any;
  
  public showIssue(issue: IssuesListForRepoResponseItem): void {
    this.modalIssue = issue;
    this.modalService.open(this.modal, {size: 'lg'});
  }
  
  /* --------------------------------------- */

  constructor(private modalService: NgbModal) { }

}
