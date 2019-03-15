import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { MarkdownModule } from 'ngx-markdown';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { IssueService } from './issue-service/issue.service';

import { AppComponent } from './app.component';
import { IssuesListComponent } from './issues-list/issues-list.component';
import { IssueModalComponent } from './issue-modal/issue-modal.component';
import { IssueAssigneesComponent } from './issue-sections/issue-assignees.component';
import { IssueTitleComponent     } from './issue-sections/issue-title.component';
import { IssueUserComponent      } from './issue-sections/issue-user.component';
import { RateLimitBarComponent } from './rate-limit-bar/rate-limit-bar.component';

@NgModule({
  declarations: [
    AppComponent,
    IssuesListComponent,
    IssueModalComponent,
    IssueAssigneesComponent,
    IssueTitleComponent,
    IssueUserComponent,
    RateLimitBarComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    MarkdownModule.forRoot(),
    NgbModule.forRoot(),
  ],
  providers: [
    IssueService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
