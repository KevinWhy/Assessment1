import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbModal, NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { IssuesListForRepoResponseItem } from '@octokit/rest';

import { IssueService } from '@app/issue-service/issue.service';
import { PaginatedIssueList, ListStatus, FailReason } from '@app/issue-service/paginated-issue-list.class';
import { IssueModalComponent } from '@app/issue-modal/issue-modal.component';

@Component({
  selector: 'ais-issues-list',
  templateUrl: './issues-list.component.html',
  styleUrls: ['./issues-list.component.scss']
})
export class IssuesListComponent implements OnInit {
  issuesPage: PaginatedIssueList;
  
  @ViewChild(NgbPagination)
  private pageinationElem: NgbPagination;
  @ViewChild('loadingModal')
  private loadingModal: any;
  @ViewChild(IssueModalComponent)
  private issueModal: IssueModalComponent;
  
  get isLoadingPage(): boolean {
    return this.issuesPage.status == ListStatus.Getting;
  }
  get hasError(): boolean {
    return this.issuesPage.status == ListStatus.Failed;
  }
  get errorMsg(): string {
    if (this.issuesPage.status != ListStatus.Failed)
      return null;
    switch (this.issuesPage.failReason) {
      case FailReason.LimitExceeded:
        return "Cannot get issues. Exceeded request limit."
      case FailReason.NetworkError:
        return "Failed get issues because of the network."
      default: // UnknownReason
        return "Failed get issues for some unknown reason."
    }
  }
  
  onChangePage(newPage: number) {
    // Open a modal that can only be dismissed once the page is loaded
    this.modalService.dismissAll();
    this.modalService.open(this.loadingModal, {
      centered: true,
      beforeDismiss: () => !this.isLoadingPage
    });
    // Load the issues
    this.issuesPage.getIssuePage(newPage);
  }
  expandIssue(issue: IssuesListForRepoResponseItem) {
    this.issueModal.showIssue(issue);
  }
  
  /* ------------------------------------------ */

  constructor(
    private issueService: IssueService,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    this.issuesPage = this.issueService.getIssues();
    // When issues are loaded, dismiss loading modal
    this.issuesPage.issues.subscribe(() => {
      this.modalService.dismissAll();
    });
  }

}
