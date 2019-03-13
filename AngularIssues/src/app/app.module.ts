import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap'; // TODO: Import only what I need

import { AppComponent } from './app.component';
import { IssueService } from './issue-service/issue.service';
import { IssuesListComponent } from './issues-list/issues-list.component';

@NgModule({
  declarations: [
    AppComponent,
    IssuesListComponent
  ],
  imports: [
    NgbModule,
    BrowserModule,
    HttpClientModule,
  ],
  providers: [
    IssueService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
