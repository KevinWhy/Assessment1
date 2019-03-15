import { Component } from '@angular/core';

import { IssueService } from '@app/issue-service/issue.service';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  repoTitle: string;
  showRateBreakBttn: boolean = (
    !environment.production && !environment.useCachedResponses
  );
  get repoUrl(): string {  return this.issueService.getRepoUrl();  }
  
  maxOutRateLimit(): void {
    if (this.showRateBreakBttn)
      this.issueService.maxOutRateLimit();
  }
  
  constructor(private issueService: IssueService) { }
  
  ngOnInit() {
    this.repoTitle = environment.repoOwner +'/'+ environment.repoName;
  }
}
