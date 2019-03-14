import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { MarkdownModule } from 'ngx-markdown';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap'; // TODO: Import only what I need

import { AppComponent } from './app.component';
import { IssueService } from './issue-service/issue.service';
import { IssuesListComponent } from './issues-list/issues-list.component';
import { CollapsibleComponent } from './collapsible/collapsible.component';
import { RateLimitBarComponent } from './rate-limit-bar/rate-limit-bar.component';

@NgModule({
  declarations: [
    AppComponent,
    IssuesListComponent,
    CollapsibleComponent,
    RateLimitBarComponent
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
