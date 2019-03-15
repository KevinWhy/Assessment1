import { Component, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IssuesListForRepoResponseItem } from '@octokit/rest';

@Component({
  selector: 'ais-issue-modal',
  templateUrl: './issue-modal.component.html',
  styleUrls: ['./issue-modal.component.scss']
})
export class IssueModalComponent {
  private modalIssue: IssuesListForRepoResponseItem = undefined;
  public assigneesHidden: boolean = true;
  @ViewChild('modalTemplate')
  private modalTemplate: any;
  
  public showIssue(issue: IssuesListForRepoResponseItem): void {
    this.modalIssue = issue;
    this.modalService.open(this.modalTemplate, {size: 'lg'});
  }
  
  /* --------------------------------------- */

  constructor(private modalService: NgbModal) { }

}
