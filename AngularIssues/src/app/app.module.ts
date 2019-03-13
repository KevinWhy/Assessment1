import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { IssueService } from './issue-service/issue.service';
import { IssuesListComponent } from './issues-list/issues-list.component';

@NgModule({
  declarations: [
    AppComponent,
    IssuesListComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
  ],
  providers: [
    IssueService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
